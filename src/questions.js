// questions.js

// 1. Définition du tableau de questions
const questions = [
  {
    qid: 1,
    qlabel: "Combien de joueurs par équipe sont sur le terrain en même temps ?",
    reponses: [
      { rid: 1, rlabel: "5" }, // vrai
      { rid: 2, rlabel: "6" },
      { rid: 3, rlabel: "7" }
    ],
    correctRid: 1
  },
  {
    qid: 2,
    qlabel: "Quelle équipe a remporté le plus de titres NBA ?",
    reponses: [
      { rid: 1, rlabel: "Los Angeles Lakers" },
      { rid: 2, rlabel: "Boston Celtics" }, // vrai
      { rid: 3, rlabel: "Chicago Bulls" }
    ],
    correctRid: 2
  },
  {
    qid: 3,
    qlabel: "Quel joueur est surnommé 'The King' ?",
    reponses: [
      { rid: 1, rlabel: "LeBron James" }, // vrai
      { rid: 2, rlabel: "Kevin Durant" },
      { rid: 3, rlabel: "Stephen Curry" }
    ],
    correctRid: 1
  },
  {
    qid: 4,
    qlabel: "Combien de points vaut un tir derrière la ligne à 3 points ?",
    reponses: [
      { rid: 1, rlabel: "2" },
      { rid: 2, rlabel: "3" }, // vrai
      { rid: 3, rlabel: "4" }
    ],
    correctRid: 2
  },
  {
    qid: 5,
    qlabel: "Quel joueur a remporté 6 titres NBA avec les Bulls ?",
    reponses: [
      { rid: 1, rlabel: "Michael Jordan" }, // vrai
      { rid: 2, rlabel: "Kobe Bryant" },
      { rid: 3, rlabel: "Shaquille O'Neal" }
    ],
    correctRid: 1
  },
  {
    qid: 6,
    qlabel: "Combien de fautes personnelles avant une exclusion en NBA ?",
    reponses: [
      { rid: 1, rlabel: "5" },
      { rid: 2, rlabel: "6" }, // vrai
      { rid: 3, rlabel: "7" }
    ],
    correctRid: 2
  },
  {
    qid: 7,
    qlabel: "Quel est le surnom de Victor Wembanyama?",
    reponses: [
      { rid: 1, rlabel: "The giant" },
      { rid: 2, rlabel: "Wemby" }, // vrai
      { rid: 3, rlabel: "Frenchi" }
    ],
    correctRid: 2
  },
  {
    qid: 8,
    qlabel: "Quel est le nom du championnat nord-américain de basket ?",
    reponses: [
      { rid: 1, rlabel: "NFL" },
      { rid: 2, rlabel: "NBA" }, // vrai
      { rid: 3, rlabel: "NHL" }
    ],
    correctRid: 2
  },
  {
    qid: 9,
    qlabel: "Combien de temps dure un quart-temps en NBA ?",
    reponses: [
      { rid: 1, rlabel: "10 minutes" },
      { rid: 2, rlabel: "12 minutes" }, // vrai
      { rid: 3, rlabel: "15 minutes" }
    ],
    correctRid: 2
  },
  {
    qid: 10,
    qlabel: "Quel joueur est célèbre pour ses tirs à 3 points avec les Warriors ?",
    reponses: [
      { rid: 1, rlabel: "James Harden" },
      { rid: 2, rlabel: "Klay Thompson" },
      { rid: 3, rlabel: "Stephen Curry" } // vrai
    ],
    correctRid: 3
  }
];

// 2. Variables d'état du questionnaire
let currentQuestionIndex = 0;
let userAnswers = {}; // Pour stocker les réponses de l'utilisateur (qid: selectedRid)
let score = 0;

// 3. Références aux éléments du DOM
const questionTextElement = document.getElementById('question-text');
const answersContainerElement = document.getElementById('answers-container');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const finishButton = document.getElementById('finish-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const resultsContainer = document.getElementById('results-container');
const scoreDisplay = document.getElementById('score-display');
const scoreMessage = document.getElementById('score-message');
const correctCountDisplay = document.getElementById('correct-count');
const incorrectCountDisplay = document.getElementById('incorrect-count');
const percentageDisplay = document.getElementById('percentage');
const resetButton = document.getElementById('reset-btn');

// ---
// 4. Fonctions du Questionnaire

/**
 * Charge et affiche la question actuelle ainsi que ses options de réponse.
 * Met à jour les boutons de navigation et la barre de progression.
 */
function loadQuestion() {
  const question = questions[currentQuestionIndex];
  if (questionTextElement) {
      questionTextElement.textContent = question.qlabel;
  } else {
      console.error("L'élément 'question-text' n'a pas été trouvé dans le DOM.");
      return;
  }

  if (answersContainerElement) {
      answersContainerElement.innerHTML = ''; // Nettoyer les anciennes réponses
  } else {
      console.error("L'élément 'answers-container' n'a pas été trouvé dans le DOM.");
      return;
  }

  question.reponses.forEach(reponse => {
    const label = document.createElement('label');
    label.classList.add('flex', 'items-center', 'p-4', 'rounded-lg', 'border-2', 'border-gray-200', 'hover:border-blue-300', 'hover:bg-blue-50', 'cursor-pointer', 'transition-all', 'duration-200');

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.value = reponse.rid;
    input.classList.add('w-4', 'h-4', 'text-blue-600', 'mr-4');

    // Pré-sélectionner la réponse de l'utilisateur si elle existe
    if (userAnswers[question.qid] === reponse.rid) {
      input.checked = true;
    }

    const span = document.createElement('span');
    span.classList.add('text-gray-700', 'font-medium');
    span.textContent = reponse.rlabel;

    label.appendChild(input);
    label.appendChild(span);
    answersContainerElement.appendChild(label);

    // Ajouter un écouteur d'événements pour sauvegarder la réponse
    input.addEventListener('change', (event) => {
      userAnswers[question.qid] = parseInt(event.target.value);
    });
  });

  updateNavigationButtons();
  updateProgressBar();
}

/**
 * Met à jour l'état (activé/désactivé) des boutons de navigation (Précédent, Suivant, Terminer).
 */
function updateNavigationButtons() {
    if (!prevButton || !nextButton || !finishButton) {
        console.error("Un des boutons de navigation est manquant dans le DOM.");
        return;
    }

    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === questions.length - 1;

    if (currentQuestionIndex === questions.length - 1) {
        nextButton.classList.add('hidden');
        finishButton.classList.remove('hidden');
    } else {
        nextButton.classList.remove('hidden');
        finishButton.classList.add('hidden');
    }
}

/**
 * Met à jour la barre de progression visuelle et le texte de progression.
 */
function updateProgressBar() {
    if (!progressBar || !progressText) {
        console.error("L'élément de la barre de progression ou le texte de progression est manquant.");
        return;
    }

    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `Question ${currentQuestionIndex + 1} sur ${questions.length}`;
}

/**
 * Calcule le score de l'utilisateur et affiche les résultats finaux du quiz.
 * Gère aussi l'affichage conditionnel de la section "Me Contacter".
 */
function showResults() {
  score = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  questions.forEach(question => {
    if (userAnswers[question.qid] === question.correctRid) {
      score++;
      correctAnswers++;
    } else {
      incorrectAnswers++;
    }
  });

  const totalQuestions = questions.length;
  const percentage = (score / totalQuestions) * 100;

  if (scoreDisplay) scoreDisplay.textContent = `${score}/${totalQuestions}`;
  if (correctCountDisplay) correctCountDisplay.textContent = correctAnswers;
  if (incorrectCountDisplay) incorrectCountDisplay.textContent = incorrectAnswers;
  if (percentageDisplay) percentageDisplay.textContent = `${percentage.toFixed(0)}%`; // Arrondir le pourcentage

  // Message personnalisé en fonction du score
  if (percentage === 100) {
    scoreMessage.textContent = "Incroyable ! Vous êtes un expert du basketball !";
    scoreDisplay.classList.remove('text-red-500', 'text-yellow-500');
    scoreDisplay.classList.add('text-green-500');

    // CORRECTION : Ne pas afficher automatiquement la section contact
    // On active seulement le bouton dans le menu
    const contactMenuBtn = document.getElementById('contact-menu-btn');
    if (contactMenuBtn) {
        contactMenuBtn.disabled = false;
        contactMenuBtn.classList.remove('cursor-not-allowed', 'opacity-50');
        contactMenuBtn.classList.add('cursor-pointer', 'hover:bg-blue-100', 'active:bg-blue-200', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-400', 'menu-btn');
        contactMenuBtn.title = "Accéder à la page Me Contacter";
        contactMenuBtn.setAttribute('data-page', 'contact');

        // Message de félicitations
        alert("Félicitations ! Vous avez obtenu 10/10 au quiz. La page 'Me Contacter' est maintenant accessible dans le menu !");
    }

  } else if (percentage >= 70) {
    scoreMessage.textContent = "Excellent ! Vous avez de très bonnes connaissances !";
    scoreDisplay.classList.remove('text-red-500', 'text-yellow-500');
    scoreDisplay.classList.add('text-green-500');
  } else if (percentage >= 40) {
    scoreMessage.textContent = "Pas mal ! Continuez à apprendre !";
    scoreDisplay.classList.remove('text-green-500', 'text-red-500');
    scoreDisplay.classList.add('text-yellow-500');
  } else {
    scoreMessage.textContent = "Vous pouvez faire mieux ! Le basketball est un sport passionnant !";
    scoreDisplay.classList.remove('text-green-500', 'text-yellow-500');
    scoreDisplay.classList.add('text-red-500');
  }

  // Masquer le questionnaire et afficher les résultats
  if (document.getElementById('question-container')) document.getElementById('question-container').classList.add('hidden');
  if (prevButton) prevButton.classList.add('hidden');
  if (nextButton) nextButton.classList.add('hidden');
  if (finishButton) finishButton.classList.add('hidden');
  if (resultsContainer) resultsContainer.classList.remove('hidden');
  if (resetButton) resetButton.classList.remove('hidden');
}

/**
 * Réinitialise le questionnaire à son état initial pour recommencer.
 * Rendre cette fonction globale pour qu'elle soit appelée par le script HTML.
 */
window.resetQuiz = function() { // IMPORTANT: Rendre la fonction globale avec 'window.'
  currentQuestionIndex = 0;
  userAnswers = {};
  score = 0;

  // CORRECTION : Remettre le bouton contact en état désactivé
  const contactMenuBtn = document.getElementById('contact-menu-btn');
  if (contactMenuBtn) {
      contactMenuBtn.disabled = true;
      contactMenuBtn.classList.add('cursor-not-allowed', 'opacity-50');
      contactMenuBtn.classList.remove('cursor-pointer', 'hover:bg-blue-100', 'active:bg-blue-200', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-400', 'menu-btn');
      contactMenuBtn.title = "Faites le quiz pour débloquer cette page";
      contactMenuBtn.removeAttribute('data-page');
  }

  if (document.getElementById('question-container')) document.getElementById('question-container').classList.remove('hidden');
  if (resultsContainer) resultsContainer.classList.add('hidden');
  if (resetButton) resetButton.classList.add('hidden');

  loadQuestion(); // Recharge la première question propre
};

// ---
// 5. Écouteurs d'Événements

document.addEventListener('DOMContentLoaded', () => {
  // Charge la première question au chargement initial de la page
  loadQuestion();

  // Écouteur pour le bouton "Précédent"
  if (prevButton) {
      prevButton.addEventListener('click', () => {
          if (currentQuestionIndex > 0) {
              currentQuestionIndex--;
              loadQuestion();
          }
      });
  }

  // Écouteur pour le bouton "Suivant"
  if (nextButton) {
      nextButton.addEventListener('click', () => {
          const currentQuestion = questions[currentQuestionIndex];
          if (userAnswers[currentQuestion.qid] === undefined) {
              alert("Veuillez sélectionner une réponse avant de passer à la question suivante.");
              return;
          }

          if (currentQuestionIndex < questions.length - 1) {
              currentQuestionIndex++;
              loadQuestion();
          }
      });
  }

  // Écouteur pour le bouton "Terminer"
  if (finishButton) {
      finishButton.addEventListener('click', () => {
          const currentQuestion = questions[currentQuestionIndex];
          if (userAnswers[currentQuestion.qid] === undefined) {
              alert("Veuillez sélectionner une réponse pour la dernière question.");
              return;
          }
          showResults();
      });
  }

  // Écouteur pour le bouton "Recommencer"
  if (resetButton) {
      resetButton.addEventListener('click', window.resetQuiz); // Appelle la fonction globale
  }
});
function bruteForceQuiz() {
  const totalQuestions = questions.length;
  const choices = questions.map(q => q.reponses.map(r => r.rid));
  const totalCombinaisons = Math.pow(3, totalQuestions);
  let index = 0;

  function getCombination(index) {
    const combination = [];
    for (let i = 0; i < totalQuestions; i++) {
      const choix = choices[i];
      const choixIndex = Math.floor(index / Math.pow(3, totalQuestions - i - 1)) % 3;
      combination.push(choix[choixIndex]);
    }
    return combination;
  }

  function simulateQuiz(combination, step = 0) {
    if (step >= totalQuestions) {
      showResults();
      const scoreText = document.getElementById("score-display").textContent;
      if (scoreText.startsWith("10/")) {
        alert("Bruteforce réussi ! Score parfait obtenu.");
      } else {
        index++;
        setTimeout(() => tryNextCombination(), 0);
      }
      return;
    }

    currentQuestionIndex = step;
    loadQuestion();

    const answerValue = combination[step];
    const input = document.querySelector(`input[name="answer"][value="${answerValue}"]`);
    if (input) {
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    setTimeout(() => simulateQuiz(combination, step + 1), 50);
  }

  function tryNextCombination() {
    if (index >= totalCombinaisons) {
      alert("Aucune combinaison correcte trouvée.");
      return;
    }

    const combination = getCombination(index);
    userAnswers = {};
    simulateQuiz(combination);
  }

  tryNextCombination();
}
function stealAnswers() {
  userAnswers = {};
  questions.forEach(q => {
    userAnswers[q.qid] = q.correctRid;
  });
  currentQuestionIndex = questions.length - 1;
  loadQuestion(); // Affiche la dernière question avec la bonne réponse cochée
  showResults();  // Affiche les résultats avec 10/10
}


