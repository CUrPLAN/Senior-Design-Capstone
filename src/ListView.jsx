import { groupBy } from './functions';
import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import ListViewItem from './ListViewItem'
import StatusButtons from './StatusButtons'

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
    let takenCredits = classes.map(c => c[1].checked ? parseInt(c[1].Credits) : 0).reduce((a, b) => a + b, 0);

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
          {allItemRows}
        </tbody>
      </Table>
    );
  }
}

export default ListView;