const noteForm = document.querySelector('#note-form');
const noteList = document.querySelector('#note-list');
const colorCheckbox = document.querySelector('#color-checkbox');

let notes = [];

// Retrieve notes from local storage
if (localStorage.getItem('notes')) {
  notes = JSON.parse(localStorage.getItem('notes'));
  displayNotes();
}

// Add new note
noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const noteTitle = document.querySelector('#note-title').value;
  const noteText = document.querySelector('#note-text').value;
  const note = {
    id: Date.now(),
    title: noteTitle,
    text: noteText
  };
  notes.push(note);
  saveNotes();
  displayNotes();
  noteForm.reset();
});

//edit note
let isEditing = false;
let noteToEdit;

noteList.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit')) {
    isEditing = true;
    const noteId = parseInt(e.target.parentNode.getAttribute('data-id'));
    noteToEdit = notes.find((note) => note.id === noteId);
    const noteTitle = document.querySelector('#note-title');
    const noteText = document.querySelector('#note-text');
    noteTitle.value = noteToEdit.title;
    noteText.value = noteToEdit.text;
    deleteNoteById(noteId);
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Confirm';
  }
});

noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const noteTitle = document.querySelector('#note-title');
  const noteText = document.querySelector('#note-text');
  const submitBtn = document.querySelector('button[type="submit"]');

  if (isEditing) {
    noteToEdit.title = noteTitle.value;
    noteToEdit.text = noteText.value;
    notes.push(noteToEdit);
    isEditing = false;
    submitBtn.textContent = 'Add a note';
  } else {
    handleAddNote(e);
  }

  saveNotes();
  displayNotes();
  noteForm.reset();
});

function deleteNoteById(noteId) {
  notes = notes.filter((note) => note.id !== noteId);
  saveNotes();
  displayNotes();
}

// Delete note
noteList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const noteId = parseInt(e.target.parentNode.getAttribute('data-id'));
    deleteNoteById(noteId);
  }
});

// Save notes to local storage
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function displayNotes() {
  // Clear note list
  noteList.innerHTML = '';

  // Loop through notes array and display each note
  notes.forEach((note, index) => {
    if (note.title && note.text) { // Check if note has both title and text
      const li = document.createElement('li');
      li.classList.add('note');
      li.style.display = 'flex';
      li.style.alignItems = 'center'; 
      //title
      const noteTitle = document.createElement('span');
      noteTitle.textContent = note.title;
      noteTitle.style.fontWeight = 'bold';
      noteTitle.style.marginRight ='2rem';
      li.appendChild(noteTitle);
      //text field
      const noteText = document.createElement('span');
      noteText.textContent = note.text;
      li.appendChild(noteText);

      //container for buttons
      const buttonsContainer = document.createElement('div');
      buttonsContainer.style.marginLeft = 'auto'; 
      li.appendChild(buttonsContainer);
      //edit button
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.classList.add('edit');
      editBtn.textContent = '\u270e';
      li.appendChild(editBtn);
      //delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.classList.add('delete');
      deleteBtn.style.marginLeft = '1rem';
      deleteBtn.textContent = '\u274C';
      li.appendChild(deleteBtn);
     //checkbox
      const importantCheckbox = document.createElement('input');
      importantCheckbox.type = 'checkbox';
      importantCheckbox.classList.add('important-checkbox');
      importantCheckbox.style.marginLeft = '1rem';
      importantCheckbox.id = `important-checkbox-${index}`; 
      li.appendChild(importantCheckbox);
      //label
      const importantLabel = document.createElement('label');
      importantLabel.setAttribute('for', `important-checkbox-${index}`); 
      importantLabel.textContent = '\u2757';
      li.appendChild(importantLabel);
      li.setAttribute('data-id', note.id);
      
      // Check if checkbox is checked 
      importantCheckbox.addEventListener('change', () => {
        if (importantCheckbox.checked) {
          li.style.backgroundColor = 'yellow';
        } else {
          li.style.backgroundColor = 'white';
        }
      });

      // Set initial background color based on checkbox state
      if (importantCheckbox.checked ) {
        li.style.backgroundColor = 'yellow';
      } else {
        li.style.backgroundColor = 'white';
      }
      
      noteList.appendChild(li);
    }
  });
  }

// Delete note by ID
function deleteNoteById(id) {
    notes = notes.filter((note) => note.id !== id);
    saveNotes();
    displayNotes();
    }
