# Development Notes
**When using repl, the webpage can be opened at:**
https://senior-design-capstone.curplan.repl.co/

**When running on a local computer**
use the command ```npm run dev``` to run the dev server

**To deploy to github pages after a major edit:** run the deploy file with ```./deploy.sh```

**Public folder** includes the csreqs.json file which has all the class and scheduling information in it.

# Senior-Design-Capstone
### Project Name: CUrPLAN


### Problem Statement:  
We are a team of 4 undergraduate students who have struggled with planning which classes to take each semester in order to graduate with a Bachelor's of Science degree in Computer Science. Every semester as students, we all have to figure out what classes we need and want to take for the next semester to stay on track with obtaining our degrees in a limited number of years while trying to figure out our career journeys. Currently, CU Denver's Computer Science and Engineering Department offers resources such as advisors, the degree audit, a pdf of the list of elective courses available for the upcoming semester, a degree map, and the registration cart to find and add classes. The current issue is, all these resources are available to us, but it is really hard to obtain and keep the resources together since they come either from our school emails, UCDAccess, and on the CU Denver website. It is also time consuming to figure out how far along we are with completing our degree, finding which requirements we still need to fulfill, and what classes will satisfy those requirement, while lining it up with our other responsibilities outside of university. We plan to create an application that will help current students save time on figuring out which classes to take each semester and use it to help create unique degree plans for students to graduate with a BS in Computer Science on time.

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
6. Users will be able automatically adjust plan based on how many years they want to graduate in and/or how many credits they wish to take per semester
