// Do not run this file, everything here is code snippet and should be used in the mongodb shell

// Pipeline to convert date field to timestamp - WarmupApi.email_lists
db.email_lists.updateMany(
    {},
    [
      {
        $set: {
          // Convert the date string to a UTC timestamp in seconds
          "createdAt": {
            $toInt: {
              $divide: [
                { $toLong: { $toDate: "$createdAt" } },
                1000
              ]
            }
          }
        }
      },
      {
        $set: {
          // Convert the date string to a UTC timestamp in seconds
          "lastModified": {
            $toInt: {
              $divide: [
                { $toLong: { $toDate: "$lastModified" } },
                1000
              ]
            }
          }
        }
      }
    ]
  )

  // Pipeline to convert date field to timestamp - WarmupApi.mail_servers
db.mail_servers.updateMany(
    {},
    [
      {
        $set: {
          // Convert the date string to a UTC timestamp in seconds
          "addedOn": {
            $toInt: {
              $divide: [
                { $toLong: { $toDate: "$addedOn" } },
                1000
              ]
            }
          }
        }
      },
      {
        $set: {
          // Convert the date string to a UTC timestamp in seconds
          "lastModified": {
            $toInt: {
              $divide: [
                { $toLong: { $toDate: "$lastModified" } },
                1000
              ]
            }
          }
        }
      }
    ]
  )

  // Pipeline to convert date field to timestamp - WarmupApi.warmup_days
  db.warmup_days.updateMany(
    {},
    [
      {
        $set: {
          // Convert the date string to a UTC timestamp in seconds
          "date": {
            $toInt: {
              $divide: [
                { $toLong: { $toDate: "$date" } },
                1000
              ]
            }
          }
        }
      }
    ]
  )

  // Pipeline to convert date field to timestamp - WarmupApi.warmups
  db.warmups.updateMany(
    {},
    [
      {
        $set: {
          // Convert the date string to a UTC timestamp in seconds
          "createdAt": {
            $toInt: {
              $divide: [
                { $toLong: { $toDate: "$createdAt" } },
                1000
              ]
            }
          }
        }
      },
      {
        $set: {
          // Convert the date string to a UTC timestamp in seconds
          "startedAt": {
            $toInt: {
              $divide: [
                { $toLong: { $toDate: "$startedAt" } },
                1000
              ]
            }
          }
        }
      },
      {
        $set: {
            "scheduledAt": "$startedAt"
        }
      }
    ]
  )