// Global array to store notes
let notes = [];

class Note {
  // FIXED: Added readOnly parameter logic
  constructor(id, content = "", readOnly = false) {
    this.id = id;
    this.element = document.createElement("div");
    this.element.className = "note-container"; // Changed to note-container to match style

    // Create the Text Area
    this.inputField = document.createElement("textarea");
    this.inputField.value = content;

    // FIXED: You wrote 'this.textarea' before, corrected to 'this.inputField'
    if (readOnly) {
      this.inputField.readOnly = true;
    }

    this.element.appendChild(this.inputField);

    // FIXED: The appendChild for the button MUST be inside this if block.
    // Otherwise, the Reader page crashes trying to append an undefined button.
    if (!readOnly) {
      this.removeBtn = document.createElement("button");
      this.removeBtn.innerText = messages.REMOVE;
      this.removeBtn.onclick = () => {
        this.remove();
      };
      this.element.appendChild(this.removeBtn);
    }

    document.getElementById("storedNotes").appendChild(this.element);
  }

  remove() {
    this.element.remove();
    notes = notes.filter((n) => n.id !== this.id);
  }
}

function createNote() {
  const id = Date.now();
  const note = new Note(id);
  notes.push(note);
}

// FIXED: Removed the floating setInterval(saveToLocalStorage, 2000) from here.
// It caused the Reader page to overwrite the Writer data!

function saveToLocalStorage() {
  const dataToSave = [];
  notes.forEach((note) => {
    const currentText = note.inputField.value;
    dataToSave.push({ id: note.id, content: currentText });
  });

  localStorage.setItem("writerData", JSON.stringify(dataToSave));

  updateTime();
}

function updateTime() {
  const now = new Date().toLocaleTimeString();
  const timeLabel = document.getElementById("saveTime");

  if (timeLabel) {
    timeLabel.innerText = messages.WRITER_TIME + now;
  }
}

// FIXED: Added 'isReadOnly' parameter here so the function knows what mode it is in
function loadNotes(isReadOnly = false) {
  document.getElementById("storedNotes").innerHTML = "";
  notes = [];

  const savedData = localStorage.getItem("writerData");
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    parsedData.forEach((noteData) => {
      // Now we pass the correct isReadOnly flag to the class
      const note = new Note(noteData.id, noteData.content, isReadOnly);
      notes.push(note);
    });
  }
}


// If we are on Writer Page
if (document.getElementById("saveTime")) {
  loadNotes(false); // Load editable notes
  setInterval(saveToLocalStorage, 2000); // Start auto-save

  // If we are on Reader Page
} else if (document.getElementById("readerTime")) {
  readerReload(); // Load immediately
  setInterval(readerReload, 2000); // Check for updates every 2 seconds
}

function readerReload() {
  // Force reload with readOnly set to TRUE
  loadNotes(true);

  const timeLabel = document.getElementById("readerTime");
  if (timeLabel) {
    timeLabel.innerText =
      messages.READER_TIME + new Date().toLocaleTimeString();
  }
}
