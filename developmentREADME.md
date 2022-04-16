# Important Links
### Important Documentation Folder
https://drive.google.com/drive/folders/1M-zmEioaP0lgG69y0GnedZyt9raaNSc9?usp=sharing
#### Folder Contents:
* Requirements document
* Test cases
* Use cases
* Core requirements for each stakeholder
* Notes gathered from Surveys
* UI design
* UML design

### Stakeholder Video Meetings Folder
https://drive.google.com/drive/folders/1IAK3iHSIEFn_ipuxUQAXaAAQE0N9XmuD?usp=sharing
#### Folder Contents:
* Video Recordings from our all of our stakeholder meetings.

### Stakeholder Documentation Folder
https://drive.google.com/drive/folders/1qYzz8fb-Efu3vGy82wOEvQKJ-XePLSdV?usp=sharing
#### Folder Contents:
* Documentation to go along with stakeholder video recordings
* Surveys 1 and 2

# Development Notes
**When using repl, the webpage can be opened at:**
https://senior-design-capstone.curplan.repl.co/

**When running on a local computer**
use the command ```npm run dev``` to run the dev server

### To deploy to github pages after a major edit:
run the deploy file with ```./deploy.sh```

This will deploy the web app to https://curplan.github.io/Senior-Design-Capstone/.

The **/public folder** includes the csreqs.json file which has all the class and scheduling information in it. All referenced images or files should be included in this folder, since the files in this folder will be included in the deployment unchanged. If image files are in the /src folder, they will not display. 

## General Notes about Implementation
The flowchart is being created and filled in with appropriate classes every time it reloads --> this prevents the issue of having a class fill in an elective spot, then having to fix every breadth course if a breadth course is taken away (makes it a bit more understandable from a coding standpoint, and isn't a big performance hit).

## Format of Json File "csreqs.json"
This information could all be stored in a database, and fetched. For right now, it's in a static json.

*Note: an object is similar to a dictionary in python or hash map in c/c++.*

This file has the elements: 
- Color Order
    - **May not be needed** if you want to allow them to mess up the order of the categories and we put the flowchart classes in lists by semester
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

### Justification for current organization:
- ClassDesc being an object with the key of the class id makes it easy to access the ClassDesc for display on the flowchart, and causes minimal issues when creating the list for the list view
    - If the classes were in lists by their fulfills category, it might be easier to create the default list view, but searching for a specific class would be difficult (and that's done more often) -- also, implementing a different sorting / segmentation method would be difficult
- Categories is a dictionary with the features that could go in a list by the fulfills category: credits, notes, but this way it's easier to access the attributes when we just have a classID
- Prereqs are just an auto-generated list of strings of the right format from the description, and right now, we assume that its a one dimensional list of class ids --> this makes it easier to parse, but isn't very comprehensive for situations like MATH 3195, which can be filled if the student takes MATH 3191 and 3200?


### Some considerations for changes:
- Classes could probably be renamed to Semesters or something, and then we could have it in a format of a list of objects, each of which contains the semester / year of the classes, and then the list of classes
- Credits could probably be a number
Then we just have a format like:
    [{
        Semester: "Spring" / "Fall" / "Summer",
        Year: 4, 
        Classes: [{ "Name": STRING, "Credits": INT, "Color": CATEGORY }]
    }]
- Should we come up with a new structure for storing the status: Planned or Taken
- Credits could just be a value 
    - definitely for the flowchart, where it should be the required #
    - for the classdesc, there are some classes with a range of values - it would be easier if it was just an integer though
- Restrictions are currently associated with flowchart classes, would they make more sense associated with the class descriptions instead???
- Paths are associated with the classID, since the fulfills category is associated with it anyway (we could add this to the category like a list of paths like [["PHYS 2311", "PHYS 2321", "PHYS 2331", "PHYS 2341"], ["PHYS 2311", "PHYS 2321", "PHYS 2331", "PHYS 2341"], ["PHYS 2311", "PHYS 2321", "PHYS 2331", "PHYS 2341"]])


### To Create this file:
- Use the provided ipynb notebook to run through the process with a pdf flowchart and list view to create the categories.
- Or manually define some information:
    - The color order & colors can easily be manually defined.
    - With some effort, so can the classes & categories.
    - Use the ipynb notebook to fetch all the information from the school's webpages for the classes. Note: prereqs should be checked, as they are likely to be wrong. 
