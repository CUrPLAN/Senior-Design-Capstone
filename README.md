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

### Features Currently Implemented in the Web App  
1) JSON file of B.S. computer science requirements for current admission year.  
2) Edit Classes mode for the student to select C.S. classes and general core credit classes they have already taken or plan to take.  
	1) Menu options for Edit Classes button, to filter to view specific types of classes (C.S. classes or gen ed classes)  
	2) Group list view options with collapsible headers in the edit mode.   
	3) Each category shows the number of credits taken in the category.   
	4) Status toggle buttons for each class (taken, planned, or neither).  
3) Dynamic flowchart view mode for the student to view which classes they have already completed for the degree, and the classes the student still needs to take in the upcoming semesters.  
	1) Includes legend at the bottom to help users understand what colors on flowchart mean.  
	2) Students can drag classes to a specific semester.  
	3) Class restrictions implemented based on students' current degree plan and where the student drags the chosen course.  
		1) Class is restricted to Fall only or Spring only.  
		2) Class has a prerequisite restriction.  
	4) Highlighting courses that are prerequisites on the flowchart by hovering over the course.  
	5) Breadth courses populate on flowchart based on classes taken in edit mode.  
	6) Provide more information when a user clicks on a class in flowchart mode (Description of what the class offers students).  
	7) Flowchart is modified based on the science credit options and the route the student takes (bio/chem/physics).  
		1) Bio and Chem classes are 1-2 credits short in the CS BS degree, while Physics classes fulfill all the credit requirements.  
		2) The science route taken is based on the total number of science classes of that type chosen (if there are more physics classes taken than chem classes, then the flowchart will display the physics classes).  
	8) Each semester in the flowchart view shows minimum credit hours completed per semester (and in total) based on the classes checked as 'Taken'.  
	9) Users can click the ‘Expand All Flowchart Boxes” checkbox in the top right corner of the flowchart view to show all the class information.  
4) Saves flowchart view to pdf functionality using web browser or print button.  
5) Save the current state to the json file to continue the degree plan later.  
6) Users can upload a previously saved json continuation file to the web app by clicking on the upload button that displays a file dialog or by dragging and dropping the file in the drop zone.  
	1) Message stating whether or not the file uploaded successfully will be displayed.  
7) Option to add custom classes (user-entered class id/credits, for an elective class or a missing class)  
	1) Message appears if the custom class was not able to be added.   
