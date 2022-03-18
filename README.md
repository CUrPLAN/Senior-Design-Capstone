# Development Notes
**When using repl, the webpage can be opened at:**
https://senior-design-capstone.curplan.repl.co/

**When running on a local computer**
use the command ```npm run dev``` to run the dev server

**To deploy to github pages after a major edit:** run the deploy file with ```./deploy.sh```

**Public folder** includes the csreqs.json file which has all the class and scheduling information in it.

## Format of Json File "csreqs.json"
Note: an object is similar to a dictionary in python or hash map in c/c++.

This file has the elements: 
- Color Order
    - Format: List of strings that represent color categories
    - Used for: Determining the order to sort the classes in each semester of the flowchart.
- Colors
    - Format: Object, mapping a string that represents a color category to a string that represents a hex color
    - Used for: Determining the colors to color the boxes on the flowchart.
    - Relations: Must have same elements as color order.
- Classes
    - Format: List of Objects
        - Properties of each object:
            - Name: The name for the flowchart box (class id or general requirement to be filled)
            - Credits: String representing the number of credits needed for that class (Note: If students have options to take a class with less credits but need to eventually take a higher amount of credits, put the higher amount here, as a class will by dynamically added if they take less credits than needed)
            - Semester: The name for the semester this class should be located in on the flowchart. (These must correspond to each other.)
            - Color: The color category that the box on the flowchart should be colored with (from color order/ colors)
    - Used for: Displaying all of the classes on the flowchart.
- Categories
    - Format: Object mapping category name to these properties:
        - Credits: Number of credits in total needed to fulfill this category's requirements.
        - Notes: Any notes about how to fulfill the category's requirements.
        - FC_Name: If a class fulfills the category, what is the original name of the flowchart box that it should replace?
        - Fallback: If a class can fulfill multiple categories.
    - Used for: Displaying edit view categories and determining which flowchart box classes should be put in.
- ClassDesc
    - Format: Object mapping string ID of course to an object
        - Properties of each object:
            - Name: String of the full name of course
            - Credits: String of how many credits this course provides
            - Desc: String of description of course, with many details
            - Fulfills: String indicating which category the course fulfills
            - Prereqs: List of strings indicating which classes must be taken before this one
    - Used for: Displaying information about the class on the edit view and flowchart view. 

### To Create this file:
- Use the provided ipynb notebook to run through the process with a pdf flowchart and list view to create the categories.
- Or manually define some information:
    - The color order & colors can easily be manually defined.
    - With some effort, so can the classes & categories.
    - Use the ipynb notebook to fetch all the information from the school's webpages for the classes. Note: prereqs should be checked, as they are likely to be wrong. 

# Senior-Design-Capstone
### Project Name: CUrPLAN

### Background on project name:
CUrPLAN is a unique and customizable degree planning app (currently for computer science students getting a bachelor's degree) that helps students plan their degree without having to remember all the prereqs and restrictions for planning out classes. The name can be said in two ways: C Ur PLAN (see your plan) or CU PLAN (CU for the name of the school, and saying it as is while ignoring the lowercase 'r'). 

### Problem Statement:  
It’s 2022, there are a plethora of planner apps that help us organize and prioritize all the activities in our lives, yet currently our course-planning system does not provide the same kind of modernized, interactive experience that current students would expect. Every semester, students have to figure out what classes they need to take for the next semester to stay on track with obtaining their degrees while trying to figure out their career journeys. Currently, CU Denver's Computer Science and Engineering Department offers resources such as advisors, the degree audit, a pdf of the list of elective courses available for the upcoming semester, a static flowchart of the Computer Science BS degree map, and the registration cart to find and add classes. Even though all these resources are available to the students, it’s hard to keep track of them since they come from so many different places. It’s also time-consuming to figure out how far along students are with completing their degree, finding which requirements they still need to fulfill, and what classes will satisfy those requirements, all while lining it up with their other responsibilities outside of the university. In other words, the current resources aren’t interactive or geared towards students’ unique circumstances. Our project, CUrPLAN, is an interactive and customizable web application for the Computer Science BS degree that saves students from having to manually plan out their classes and making mistakes that would delay their graduation.

### Goals:
After Fall 2021, we will have the basic functional prototype done and working. This prototype will be our MVP that will satisfy these basic requirements:

1. A user interface that displays a degree map for the BS CS degree (which will imitate the degree chart given by the CS department). It will show which CS classes they have already fulfilled and which CS classes/credits they need to take to stay on track for graduating in 4 years.
2. The user will be able to add courses from the BS CS degree path that they have already taken to their degree plan through a list like interface. The courses they have added will be noted on the degree map in order to facilitate easier planning.
3. Each course list prerequisite courses in the description if there are courses that need to be taken before.
4. On hovering above a course on the degree map, information about the course will be displayed, including indications of which other courses are pre-requisites for that course.
5. The user will be able to save the courses they selected to a file, and upload that file to continue planning at a later time.

After Spring 2022, we will include additional features:

1. Each course will have a basic description about what is taught in the course. 
2. Additional courses for general CU Denver Core classes will be added to the options. 
3. Users will be able to use their degree plan to insert information about the courses they have already taken.
4. Users will be able to adjust plan manually based on what they are planning to take.
5. Degree map will automatically shift classes based on if they have been taken.
