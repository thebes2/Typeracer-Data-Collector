# Typeracer-Data-Collector

Collects data about a user's past races on [typeracer](https://play.typeracer.com).

## Setup

Ensure you have Node and npm installed. To-do...

## Usage

In a terminal at the root of the respository, run
```
npm start run -- <USERID>
```
where `<USERID>` is the typeracer username of the user you wish to collect data about. The WPM, accuracy, and passage length of each of the user's races will be stored in a file called `result.csv` in the root of the respository. You can optionally replace `run` with `debug` to execute the synchronous version of the script for debugging purposes.