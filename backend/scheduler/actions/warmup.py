from scheduler.actions.mail import send_warmup_emails
from scheduler.models import *
from scheduler.settings import (
    logger,
    generate_random_string,
    SCHEDULER_CLIENT_HOST,
    SCHEDULER_CLIENT_PORT,
    current_utc_timestamp
)
from apscheduler.schedulers.background import BackgroundScheduler
from rpyc.core.protocol import Connection
import rpyc


def remove_job(job_id):
    scheduler_conn: Connection = rpyc.connect(
        SCHEDULER_CLIENT_HOST, SCHEDULER_CLIENT_PORT
    )
    scheduler_conn.root.remove_job(job_id)


def x_of_y(x, y):
    result = x * y
    rounded_result = round(result)
    return rounded_result


def periodic_warmup(*args, warmup_: Warmup, **kwargs):
    warmup_id = str(warmup_.id)
    warmup: Warmup = Warmup.find(Warmup.id == warmup_.id).first_or_none()

    if warmup is not None:
        if warmup.current_warmup_day >= 0:
            warmup.state = "running"
            warmup.save_changes()

        if warmup.state == "failed":
            logger.error(
                f"Warmup [state: {warmup.state}] : [{warmup.status_text}] [{warmup_id}] => {warmup.name} => Day {warmup.current_warmup_day + 1}"
            )
        elif warmup.state == "paused":
            logger.warning(
                f"Warmup [state: {warmup.state}] : [{warmup.status_text}] [{warmup_id}] => {warmup.name} => Day {warmup.current_warmup_day + 1}"
            )
        else:
            logger.info(
                f"Warmup [state: {warmup.state}] [{warmup_id}] => {warmup.name} => Day {warmup.current_warmup_day + 1}"
            )

        # Check warmup state
        if warmup.state == "paused":
            # logger.info(f"Warmup [{warmup_id}] is paused")
            return

        mail_server = MailServer.find(
            MailServer.id == warmup.mailserver_id
        ).first_or_none()
        if not mail_server:
            warmup.state = "failed"
            warmup.status_text = "Invalid mailserver, please consider updating the mail server details or pause/delete this warmup"
            warmup.save_changes()
            return
        warmup.state = "running"
        warmup.status_text = "Warmup is running without any issues :)"
        warmup.save_changes()

        # Check warmup day
        if warmup.current_warmup_day + 1 > warmup.max_days:
            logger.info(f"Warmup [{warmup_id}] completed")
            remove_job(warmup_id)
            warmup.state = "completed"
            warmup.status_text = "Warmup has been completed"
            warmup.save_changes()

        # mail_server = MailServer.find(MailServer.id == warmup.mailserver_id).first_or_none()
        # if not mail_server:
        # 	warmup.state = "failed"
        # 	warmup.save_changes()
        # 	return

        client_email_list = EmailList.find(
            EmailList.id == warmup.client_email_list_id
        ).first_or_none()
        reply_email_list = EmailList.find(
            EmailList.id == warmup.reply_email_list_id
        ).first_or_none()

        batch_id = generate_random_string(length=12)

        if warmup.auto_responder_enabled:
            if not reply_email_list:
                warmup.state = "failed"
                warmup.status_text = "Invalid reply email list while autoresponder is enabled. Please add a reply email list or pause/delete this warmup"
                warmup.save_changes()
                return

        else:
            # Auto responder is off - We are only sending to client emails and not ours
            # warmup.targetOpenRate is not considered
            # warmup.targetReplyRate is not considered

            if not client_email_list:
                warmup.state = "failed"
                warmup.status_text = "Invalid client email list while autoresponder is disabled. Please add a client email list or pause/delete this warmup"
                warmup.save_changes()
                return

            # Check if warmup.current_warmup_day is 1 then use startVolume otherwise calculate new sendVolume by getting the last warmup day and using the field `actual_total_send_volume`
            send_volume = warmup.start_volume
            if warmup.current_warmup_day <= 1:
                send_volume = warmup.start_volume
            else:
                last_warmup_day = (
                    WarmupDay.find(WarmupDay.warmup_id == warmup.id)
                    .sort(-WarmupDay.nday)
                    .first_or_none()
                )
                if last_warmup_day is not None:
                    last_send_volume = last_warmup_day.actual_total_send_volume
                    if last_send_volume >= send_volume:
                        # Calculate send_volume using warmup.increase_rate
                        if 0.1 <= warmup.increase_rate < 1:
                            send_volume = (
                                x_of_y(warmup.increase_rate, last_send_volume)
                                + last_send_volume
                            )
                        elif warmup.increase_rate > 1:
                            send_volume = warmup.increase_rate + last_send_volume
            # Get new unique emails to send emails today, fail warmup if list has been used up
            unused_contacts: List[EmailDetails] = []

            for contact in client_email_list.emails:
                if contact.email not in warmup.addresses_mailed:
                    unused_contacts.append(contact)
                if (
                    len(unused_contacts) >= send_volume
                    or len(unused_contacts) >= warmup.daily_send_limit
                ):
                    break

            if len(unused_contacts) < send_volume:
                warmup.state = "failed"
                warmup.status_text = "The client email list has been used up, consider adding more contacts/emails to the list via update list or pause/delete this warmup"
                warmup.save_changes()
                return

            # Send emails to those clients
            warmup.current_warmup_day += 1
            warmup.save_changes()


            tracking_images = gen_tracking_images(batch_id, total=len(unused_contacts))
            send_warmup_emails(batch_id, unused_contacts, tracking_images, mail_server)
            logger.info(
                f"Warmup [{warmup_id}] => Warmup emails sent to {len(unused_contacts)} contacts"
            )

            # Create new WarmupDay and save results
            new_warmup_day = WarmupDay(
                warmup_id=warmup.id,
                nday=warmup.current_warmup_day,
                actual_total_send_volume=len(unused_contacts),
                date=current_utc_timestamp(),
                state="completed",
                client_emails_sent=unused_contacts,
                batch_id=batch_id,
            )

            new_warmup_day.create()
            warmup.addresses_mailed.extend(
                list({contact.email for contact in unused_contacts})
            )
            warmup.save_changes()

        # if warmup.current_warmup_day < warmup.max_days:
        #     warmup.current_warmup_day += 1
        #     try:
        #         warmup.save_changes()
        #     except AttributeError:
        #         pass

    else:
        # Warmup has been deleted
        logger.info(f"Warmup [{warmup_id}] has been deleted .. Removing job ..")
        remove_job(warmup_id)
