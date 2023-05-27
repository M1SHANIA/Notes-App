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

// Edit note
noteList.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit')) {
    const noteId = parseInt(e.target.parentNode.getAttribute('data-id'));
    const note = notes.find((note) => note.id === noteId);
    const noteTitle = document.querySelector('#note-title');
    const noteText = document.querySelector('#note-text');
    noteTitle.value = note.title;
    noteText.value = note.text;
    deleteNoteById(noteId);
    // Change text of submit button to "Confirm"
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Confirm';
    // Save edited note
    noteForm.removeEventListener('submit', handleAddNote);
    noteForm.addEventListener('submit', handleEditNote);
    function handleEditNote(e) {
      e.preventDefault();
      note.title = noteTitle.value;
      note.text = noteText.value;
      notes.push(note);
      saveNotes();
      displayNotes();
      noteForm.reset();
      submitBtn.textContent = 'Add a note';
      noteForm.removeEventListener('submit', handleEditNote);
      noteForm.addEventListener('submit', handleAddNote);
    }
  }
});

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
      li.style.alignItems = 'center'; // Center elements vertically
      
      const noteTitle = document.createElement('span');
      noteTitle.textContent = note.title;
      noteTitle.style.fontWeight = 'bold';
      noteTitle.style.marginRight ='2rem';
      li.appendChild(noteTitle);
      
      const noteText = document.createElement('span');
      noteText.textContent = note.text;
      li.appendChild(noteText);

      const buttonsContainer = document.createElement('div');
      buttonsContainer.style.marginLeft = 'auto'; // Move buttons to the right
      li.appendChild(buttonsContainer);

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.classList.add('edit');
      editBtn.textContent = 'Edit';
      li.appendChild(editBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.classList.add('delete');
      deleteBtn.style.marginLeft = '2rem';
      deleteBtn.textContent = 'Delete';
      li.appendChild(deleteBtn);
      
    li.setAttribute('data-id', note.id);
      
        // Check if checkbox is checked and note is important
        if (colorCheckbox.checked && note.important) {
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
