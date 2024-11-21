#!/bin/bash
# Unset DISPLAY to avoid issues with GUI applications
unset DISPLAY

# Create a new tmux configuration file
echo "set -g mouse on" > ~/.tmux.conf

# Install tmux if it's not already installed (make sure to handle this appropriately)
sudo apt-get install -y tmux

# Kill any existing tmux session named "server"
tmux kill-session -t server 2>/dev/null

# Start a new detached tmux session named "server"
tmux new-session -d -s server "cd ./Server && java -Xmx128M -Xms128M -jar server.jar; read -p 'Press enter to exit...'"

# Run Waterfall/Bungeecord in the second split
tmux split-window -v -t server "cd ./Waterfall && java -Xmx128M -Xms128M -jar bungee.jar; read -p 'Press enter to exit...'"

# Attach to the tmux session
