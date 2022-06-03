# Senior-Design-Capstone :)))
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

### Development Notes
For notes about the development decisions or structure, check developmentREADME.md.
