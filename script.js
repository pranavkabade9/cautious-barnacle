// Handle form submission
document.getElementById('timetableForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const subject = document.getElementById('subject').value;
    const faculty = document.getElementById('faculty').value;
    const day = document.getElementById('day').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const room = document.getElementById('room').value;

    // Validate form
    if (!subject || !faculty || !day || !startTime || !endTime || !room) {
        alert('Please fill in all fields');
        return;
    }

    // Add new row to table
    const tableBody = document.getElementById('tableBody');
    const newRow = tableBody.insertRow();

    const timeRange = startTime + ' – ' + endTime;

    newRow.innerHTML = `
        <td>${day}</td>
        <td>${subject}</td>
        <td>${faculty}</td>
        <td>${timeRange}</td>
        <td>${room}</td>
        <td><button class="delete-btn" onclick="deleteRow(this)">Delete</button></td>
    `;

    // Reset form
    document.getElementById('timetableForm').reset();

    console.log('Entry added:', { subject, faculty, day, startTime, endTime, room });
});

// Delete row function
function deleteRow(button) {
    const row = button.closest('tr');
    row.remove();
    console.log('Row deleted');
}
