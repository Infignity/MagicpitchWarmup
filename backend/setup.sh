sudo apt update && \
sudo apt upgrade -y && \
sudo apt-get install -y gh && \
sudo apt-get install -y python3-pip && \
python3 -m pip install virtualenv && \
sudo apt-get install -y docker.io && \
sudo apt-get install -y docker-compose && \
mkdir ~/Documents && mkdir ~/Documents/venvs && \
python3 -m virtualenv ~/Documents/venvs/warmup
