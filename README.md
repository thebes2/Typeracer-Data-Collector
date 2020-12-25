# Typeracer-Data-Collector

Collects data about a user's past races on [typeracer](https://play.typeracer.com).

## Setup

1. Install node. Check that it is installed by running `node --version` in a terminal.
2. Install npm. Check that it is installed by running `npm --version`.
3. Pull the repository by either downloading and extracting the zip or executing `git clone https://github.com/thebes2/Typeracer-Data-Collector.git` in the terminal.
4. Run `npm install` in the root of the repository. 

## Usage

In a terminal at the root of the respository, run
```
npm run start -- <USERID>
```
where `<USERID>` is the typeracer username of the user you wish to collect data about. The WPM, accuracy, and passage length of each of the user's races will be stored in a file called `result.csv` in the root of the respository. You can optionally replace `start` with `debug` to execute the synchronous version of the script for debugging purposes.