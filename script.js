// Function to add a quiz and save it in localStorage
function addQuiz() {
    const question = document.getElementById("quiz-question").value;
    const option1 = document.getElementById("option1").value;
    const option2 = document.getElementById("option2").value;
    const option3 = document.getElementById("option3").value;
    const option4 = document.getElementById("option4").value;
    const correctOption = document.getElementById("correct-option").value;
  
    if (question && option1 && option2 && option3 && option4 && correctOption) {
      const quiz = {
        question,
        options: [option1, option2, option3, option4],
        correctOption: parseInt(correctOption) // store correct answer as a number
      };
  
      // Retrieve existing quizzes from localStorage
      let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
      quizzes.push(quiz);
  
      // Save updated quizzes back to localStorage
      localStorage.setItem("quizzes", JSON.stringify(quizzes));
  
      alert("Quiz added successfully!");
      clearForm();
    } else {
      alert("Please fill in all fields");
    }
  }
  
  function clearForm() {
    document.getElementById("quiz-question").value = '';
    document.getElementById("option1").value = '';
    document.getElementById("option2").value = '';
    document.getElementById("option3").value = '';
    document.getElementById("option4").value = '';
    document.getElementById("correct-option").value = '';
  }
  
  // Function to display quizzes for the student to attempt
  function displayQuizzes() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = '';
  
    // Prompt student for their name
    const studentName = prompt("Enter your name:");
  
    // Retrieve quizzes from localStorage
    let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  
    // Check if the student has already submitted
    let submittedStudents = JSON.parse(localStorage.getItem("submittedStudents")) || [];
  
    // If the student has already submitted, do not show the quiz
    if (submittedStudents.includes(studentName)) {
      quizContainer.innerHTML = `<h3>Hello, ${studentName}. You have already submitted the quiz!</h3>`;
      return;
    }
  
    // If quizzes exist and the student hasn't submitted, show the quizzes
    if (quizzes.length === 0) {
      quizContainer.innerHTML = '<p>No quizzes available.</p>';
    } else {
      quizzes.forEach((quiz, index) => {
        const quizDiv = document.createElement("div");
        quizDiv.className = "quiz-item"; // Add class for styling
        quizDiv.innerHTML = `
          <h3>Question ${index + 1}: ${quiz.question}</h3>
          <input type="radio" name="quiz${index}" value="1"> ${quiz.options[0]}<br>
          <input type="radio" name="quiz${index}" value="2"> ${quiz.options[1]}<br>
          <input type="radio" name="quiz${index}" value="3"> ${quiz.options[2]}<br>
          <input type="radio" name="quiz${index}" value="4"> ${quiz.options[3]}<br>
        `;
        quizContainer.appendChild(quizDiv);
      });
  
      // Show the submit button
      document.getElementById("submit-btn").style.display = 'block';
  
      // Save the student's name to local storage to be used when submitting
      localStorage.setItem("currentStudent", studentName);
    }
  }
  
  // Function to submit the quiz and check the results
  function submitQuiz() {
    let studentAnswers = [];
    let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const studentName = localStorage.getItem("currentStudent"); // Get the current student's name
  
    // Check if quizzes exist
    if (quizzes.length === 0) {
      alert("No quizzes available to submit.");
      return;
    }
  
    // Collect the student's answers
    quizzes.forEach((quiz, index) => {
      const selectedOption = document.querySelector(`input[name="quiz${index}"]:checked`);
      studentAnswers.push(selectedOption ? parseInt(selectedOption.value) : null);
    });
  
    // Calculate score
    let score = 0;
    quizzes.forEach((quiz, index) => {
      if (studentAnswers[index] === quiz.correctOption) {
        score++;
      }
    });
  
    // Store the student's score in localStorage under a separate key
    let studentScores = JSON.parse(localStorage.getItem("studentScores")) || [];
    studentScores.push({ name: studentName, score: score, total: quizzes.length });
    localStorage.setItem("studentScores", JSON.stringify(studentScores));
  
    // Mark this student as having submitted the quiz
    let submittedStudents = JSON.parse(localStorage.getItem("submittedStudents")) || [];
    submittedStudents.push(studentName);
    localStorage.setItem("submittedStudents", JSON.stringify(submittedStudents));
  
    // Hide the quiz container and show the score
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = ''; // Clear the quiz container
    document.getElementById("submit-btn").style.display = 'none'; // Hide the submit button
  
    // Display the score
    const scoreMessage = document.createElement("h2");
    scoreMessage.textContent = `You scored ${score} out of ${quizzes.length}`;
    quizContainer.appendChild(scoreMessage);
  
    // Show the score to the professor
    showProfessorScore();
  }
  
  // Function to show all student scores to the professor
  function showProfessorScore() {
    const professorScoreMessage = document.getElementById("professor-score");
    const studentScores = JSON.parse(localStorage.getItem("studentScores")) || [];
  
    if (studentScores.length === 0) {
      professorScoreMessage.innerHTML = '<p>No student scores available.</p>';
      return;
    }
  
    professorScoreMessage.innerHTML = "<h3>Student Scores:</h3>";
    studentScores.forEach(scoreEntry => {
      const scoreLine = document.createElement("p");
      scoreLine.textContent = `${scoreEntry.name}: ${scoreEntry.score} / ${scoreEntry.total}`;
      professorScoreMessage.appendChild(scoreLine);
    });
  }
  
  // Display quizzes when the student page is loaded
  if (window.location.pathname.includes('student.html')) {
    window.onload = displayQuizzes;
  }
  
  // Show scores on the professor page when loaded
  if (window.location.pathname.includes('professor.html')) {
    window.onload = showProfessorScore;
  }
  