import { groupBy, getNotes } from './functions.js';
import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';

function ListViewItem(props) {
  return (
    <tr>
      <td className="courses">
        <InputGroup className='class-checkbox'>
          <InputGroup.Checkbox
            aria-label="Checkbox for class"
            onChange={props.changeFunc /* calls change function passed as property when checkbox is toggled*/}
            checked={props.checked /* sets checkboxes as checked based on property passed */}
          />
        </InputGroup>{/*this is a shorthand if else statement ? :; if condition ? output true statement : output false statement */}
        {props.Id ? props.Id : " "} {props.Name ? props.Name : " "}</td>
      <td className="credits">{props.Credits ? props.Credits.slice(0, 1) : " "}</td>
      {/*<td className="notes">{props.Notes ? props.Notes : " "}</td>*/}
      <td className="notes">{props.Prereqs ? getNotes(props.Prereqs) : " "}</td>
    </tr>
  );
}

class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRows: []
    }
  }

  /*** toggles whether row expanded when row with rowId is clicked ***/
  handleRowClick(rowId) {
    const currentExpandedRows = this.state.expandedRows;
    const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);
    //determines which rows to show based on which rows are clicked
    const newExpandedRows = isRowCurrentlyExpanded ? 
      currentExpandedRows.filter(id => id !== rowId) : currentExpandedRows.concat(rowId);
      this.setState({expandedRows : newExpandedRows});
  }

  /*** creates main row for the section, and sub rows if expanded ***/
  renderItem(section) {
    let [header, classes] = section;
    let isExpanded = this.state.expandedRows.includes(header);
    let takenCredits = classes.map(c => c[1].checked ? parseInt(c[1].Credits) : 0).reduce((a, b) => a + b);

    // add the main row to a list 
    const itemRows = [<tr key={"header"+header} onClick={() => this.handleRowClick(header)}>
      <td className="heading-courses-td"><div className={"arrow " + (isExpanded ? "down" : "right")}></div>{header}</td>
      <td className="heading-credits-td">{takenCredits + ' / ' + this.props.Categories[header].Credits}</td>
      <td className="heading-notes-td">{this.props.Categories[header].Notes}</td>
    </tr>];
    
    if(isExpanded) {
      classes.forEach(([i, course]) => (
        itemRows.push(<ListViewItem
                    key={'course' + i}
                    {...course} // pass elements of a course as properties to the ListViewItem
                  ></ListViewItem>))
      );
    }
    return itemRows;    
  }

  // ********function that handles creating the edit view and list view components, with the json info that needs to be displayed***********
  render() {
    // gets object with groups of classes by headers
    let headerList = Object.entries(groupBy(Object.entries(this.props.Class_Desc), x => x[1].Fulfills));
    // filters list by argument passed in
    if (this.props.displayChoice === 'EditGenEd') {
      headerList = headerList.filter(x => x[0].includes('Gen Ed'));
    }
    if (this.props.displayChoice == 'EditCS') {
      headerList = headerList.filter(x => !x[0].includes('Gen Ed'));
    }

    // list for storing rows of table
    let allItemRows = [];

    // calls to get the rows for each section of classes, adds them to list
    headerList.forEach(item => {
        const perItemRows = this.renderItem(item);
        allItemRows = allItemRows.concat(perItemRows);
    });
    
    return (
      <Table className='listview-table'>
        <thead>
          <tr>
            <th className='courses'>Courses</th>
            <th className='credits'>Credits</th>
            <th className='notes'>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} className="alert-td">* Course prerequisites change regularly. 
            Students are responsible for consulting advisors and the class schedule in the student portal for prerequisite information. *</td>
          </tr>
          {/*<tr>
            <td className="heading-courses-td">Required CU Denver Core Curriculum Coursework</td>
            <td className="heading-credits-td">24</td>
            <td><a href="https://catalog.ucdenver.edu/cu-denver/undergraduate/graduation-undergraduate-core-requirements/cu-denver-core-curriculum/">
              See CU Denver Core Curriculum here</a></td>
          </tr>*/}
          { allItemRows }
        </tbody>
      </Table>
    );
  }
}

export default ListView;