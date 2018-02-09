# Canvas Add Student Data
This is a CLI that creates student submission data in all the courses linked to a specific Canvas blue print master course.

## Requirements

### Enroll Students Into course
1. Enroll four students into the course
1. Two students will do all the submitting
1. Other two students are there only for group actions


### Quizzes

1. Two students compleat one quiz that contains five auto feedback questions
1. Two students compleat one quiz that is contain two teacher graded questions


### Discussion Board

1. Two students submit posts to one discussion board
1. A total of five posts alternating between the two students


### Assignments

1. One assignment that requires a **MS Word** file uploaded with two students submissions
1. One assignment that requires a **MS Excel** file uploaded with two students submissions
1. One assignment that requires a **Plane Text** typed in with two students submissions
1. One assignment that requires a **URL** typed in with two students submissions
1. One group assignment that requires only one student from each group to upload a **PDF** file


### Groups

1. Enroll all four students into a group set called *Teacher Editable* so teachers can practice editing groups
   * Two groups with two students each
1. Enroll the four students into a group set called *Group Assignment* for assignments requirement number five.
   * Two groups with two students each
   * Make sure that the two students that do the submitting end up in different groups 

# Work In Progress Below This Point

## How to Install

Install the tool globally, open the console and type:

```
npm install -g https://github.com/byuitechops/canvas-add-student-data.git
```


## How to Run

To start the tool, type this in the console:

```canvas-add-student-data courseID```

### Inputs


```js
/* Input 2 (Optional): reportTitle <string> */
reportTitle = <string> // The name of the report you want at the end
```

**If the tool uses a Command Line Interface, provide a table with the flag, aliases, and description of each commandline parameter.**

| Flag | Aliases | Description |
|------|---------|-------------|
| -regex | -r | Includes all available regex in report |
| -potato| -p | Turns report into the most versatile food on the planet |
| -meh | -m | Makes the report indifferent to all outside influences |



**If the tool takes a CSV (or similar input), use a table to show what that CSV needs to look like.**

| Course Name | OU | Course Code |
|-------------|----|-------------|
|Cow Tipping | 123456 | 101 |
|Tomato Peeling | 098675 | 202 |
|Underwater Basket Weaving | 5 | 3.14 |




### Outputs

**Describe the outputs the tool returns.**

```js
/* reportItems <object> - returned to caller */
reportItems = {
    items: [] // Array of items included in final report
}
```

**If the tool returns a CSV (or similar), use a table to describe what it will look like:**

| Course Name | OU | Course Code |
|-------------|----|-------------|
|Potato Harvest | 123456 | 101 |
|Tomato Peeling | 098675 | 202 |
|Underwater Basket Weaving | 5 | 3.14 |

**If it returns anything that do not fit in the two categories above, use a picture with an explanation to show what the user should expect.**

This program outputs a picture of campus centered on the latitude and longitude passed into the function.

Example output:

![This is alt text for the image](http://www.byui.edu/Images/campus-tour/MainArial.jpg)

## Requirements

**List all of the business requirements for the project. What are the expectations for the project? What does it need to be able to do? Example:**

- Must be able to convert all provided strings into awesome quotes from Star Wars
- Must account for students with disabilities
- Must be written in promises, without callbacks
- etc.

## Development

### Execution Process
- Include the main steps that your code goes through to accomplish its goal
- These do not need to be overly technical, but enough for a developer to read and follow along in the code (i.e. "Use a ForEach to loop through each file" is too technical)
- Use a heading for each step

Example:

#### Read in file
Read in the CSV and parse it.

#### Manipulate the data
Filter data down to what's needed and format it.

#### Provide report
Generate CSV with formatted data and write it to the hard drive.


### Setup
- Include anything important for a developer to know if they are setting up the tool to develop it more.
- This could include instructions to install certain developer dependencies.

Example:

Make sure to include `canvas-wrapper` as a developer dependency when you need it:

```
npm i --save-dev byuitechops/canvas-wrapper
```

Here are instructions on how to set up the development server:

.....

### Unit Tests
- Explain each of your unit tests and their inputs.
- Provide all inputs used in testing so developers can use the same tests (or add on to them). For example, attach a CSV for each test case.







