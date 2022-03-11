import { groupBy, getNotes } from './functions.js';
import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';


function ListViewItem(props) {
  const [checked, setChecked] = useState([props.checked]);
  const handleChange = (selectedValue) => {
    let newValue = selectedValue.filter(v => !checked.includes(v)); // gets all the classes from the selected value list that are not currently in the checked list (NOTE: is list)
    let oldValue = selectedValue.filter(v => checked.includes(v));
    if (oldValue.length > 0) {
      if (oldValue[0] === 'Planned') {
        props.plannedFunc();
      }
      if (oldValue[0] === 'Taken') {
        props.takenFunc();
      }
    }
    setChecked(newValue); 
  }

  return (
    <tr>
      <td className="courses">
        <ToggleButtonGroup 
          type='checkbox' 
          name={'takenOrPlannedSelection'+props.uniqueKey}
          value={checked}
          onChange={handleChange}
        >
            <ToggleButton
              id={"tbg-btn-1"+props.uniqueKey}
              value = {'Taken'}
              variant = {'outline-success'}
              size="sm"
              onClick={props.takenFunc} // call to mark it as taken, but won't remove it when the other buttons clicked
            >
              Taken
            </ToggleButton>
          <ToggleButton
              id={"tbg-btn-2"+props.uniqueKey}
              value = {'Planned'}
              variant = {'outline-warning'}
              size="sm"
              onClick={props.plannedFunc}
          >
            Planned
          </ToggleButton>
        </ToggleButtonGroup>
         &nbsp;&nbsp;&nbsp;
        
        {/*<InputGroup className='class-checkbox'>
          <InputGroup.Checkbox
            aria-label="Checkbox for class"
            onChange={props.changeFunc /* calls change function passed as property when checkbox is toggled}
            checked={props.checked /* sets checkboxes as checked based on property passed }
          />
        </InputGroup>*/}
        
        {/* shorthand if-else statement::: if condition ? output true statement : output false statement */}
        {props.Id ? props.Id : " "} {props.Name ? props.Name : " "}</td>
      <td className="credits">{props.Credits ? props.Credits.slice(0, 1) : " "}</td>
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
    this.setState({ expandedRows: newExpandedRows });
  }

  /*** creates main row for the section, and sub rows if expanded ***/
  renderItem(section) {
    let [header, classes] = section;
    let isExpanded = this.state.expandedRows.includes(header);
    let takenCredits = classes.map(c => c[1].checked ? parseInt(c[1].Credits) : 0).reduce((a, b) => a + b);

    // add the main row to a list 
    const itemRows = [<tr key={"header" + header} onClick={() => this.handleRowClick(header)}>
      <td className="heading-courses-td"><div className={"arrow " + (isExpanded ? "down" : "right")}></div>{header}</td>
      <td className="heading-credits-td">{takenCredits + ' / ' + this.props.Categories[header].Credits}</td>
      <td className="heading-notes-td">{this.props.Categories[header].Notes}</td>
    </tr>];

    // add children rows to the list if expanded
    if (isExpanded) {
      classes.sort((a, b) => a[1].Id.localeCompare(b[1].Id)) // sort ids alphabetically
        .forEach(([i, course]) => (
        itemRows.push(<ListViewItem
          key={'course' + i}
          uniqueKey={'course' + i}
          {...course} // pass elements of a course as properties to the ListViewItem
        ></ListViewItem>))
      );
    }
    return itemRows;
  }

  /*** function that handles creating the edit view and list view components, 
   * with the json info that needs to be displayed ***/
  render() {
    // gets object with groups of classes by headers
    let headerList = Object.entries(groupBy(Object.entries(this.props.ClassDesc), x => x[1].Fulfills));
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
            <td colSpan={3} className='heading-td'>
            <b>* Please select the classes you have taken or plan to take. *</b>
            </td>
          </tr>
          <tr>
            <th className='courses'>Courses</th>
            <th className='credits'>Credits</th>
            <th className='notes'>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} className="alert-td">* Course prerequisites change regularly.
              Students are responsible for consulting advisors and the class schedule in the student portal for prerequisite information.*
              </td>
          </tr>
          {/*<tr>
            <td className="heading-courses-td">Required CU Denver Core Curriculum Coursework</td>
            <td className="heading-credits-td">24</td>
            <td><a href="https://catalog.ucdenver.edu/cu-denver/undergraduate/graduation-undergraduate-core-requirements/cu-denver-core-curriculum/">
              See CU Denver Core Curriculum here</a></td>
          </tr>*/}
          {allItemRows}
        </tbody>
      </Table>
    );
  }
}

export default ListView;