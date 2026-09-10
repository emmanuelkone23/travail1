/**
 * ==========================================================================
 * LOGIQUE JAVASCRIPT : MyDevDashboard (Mini-Tableau de Bord Personnel)
 * Fichier : script.js
 * ==========================================================================
 */

// Clé de stockage pour le LocalStorage
const STORAGE_KEY = 'mydevdashboard_tasks';

// 1. SÉLECTION DES ÉLÉMENTS DU DOM
const currentDateEl = document.getElementById('current-date');
const taskInputEl = document.getElementById('task-input');
const addTaskBtnEl = document.getElementById('add-task-btn');
const taskListEl = document.getElementById('task-list');
const quoteTextEl = document.getElementById('quote-text');

// 2. CITATIONS MOTIVANTES (Widget Citation)
const motivationalQuotes = [
  "« Le meilleur moyen de prédire l'avenir, c'est de le créer. » – Peter Drucker",
  "« Chaque ligne de code propre est un pas de plus vers l'excellence. » – Robert C. Martin",
  "« La simplicité est la condition préalable à la fiabilité. » – Edsger W. Dijkstra",
  "« Fais de chaque jour de travail ton chef-d'œuvre. » – John Wooden",
  "« Il n'y a pas d'échec dans l'apprentissage, seulement des itérations. » – Thomas Edison",
  "« C'est en découpant les grands défis en petites tâches que l'on accomplit l'impossible. » – Proverbe Dev"
];

/**
 * Initialise et affiche la date système au format français
 * Exemple : "Jeudi 10 septembre 2026"
 */
function initCurrentDate() {
  const now = new Date();
  
  // Options de formatage complètes en français
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  const formattedDate = now.toLocaleDateString('fr-FR', options);
  
  // Met en majuscule la première lettre (ex: "jeudi..." -> "Jeudi...")
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
  if (currentDateEl) {
    currentDateEl.textContent = capitalizedDate;
  }
}

/**
 * Initialise le défilement continu des citations motivantes (bandeau ticker)
 */
function displayRandomQuote() {
  if (!quoteTextEl) return;
  // Combine l'ensemble des citations motivantes séparées par un symbole distinctif
  const tickerText = motivationalQuotes.join("     ✦     ");
  quoteTextEl.textContent = tickerText;
}

/**
 * Crée un élément DOM <li> représentant une tâche
 * @param {string} text - Contenu textuel de la tâche
 * @param {boolean} isCompleted - Indique si la tâche est terminée
 * @returns {HTMLLIElement}
 */
function createTaskElement(text, isCompleted = false) {
  const li = document.createElement('li');
  if (isCompleted) {
    li.classList.add('completed');
  }

  // Conteneur du texte de la tâche
  const spanText = document.createElement('span');
  spanText.classList.add('task-text');
  spanText.textContent = text;

  // Conteneur des boutons d'actions
  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('task-actions');

  // Bouton "Terminer" (bascule de l'état terminé)
  const completeBtn = document.createElement('button');
  completeBtn.type = 'button';
  completeBtn.classList.add('task-btn', 'btn-complete');
  completeBtn.textContent = 'Terminer';
  completeBtn.setAttribute('aria-label', `Marquer la tâche "${text}" comme terminée`);
  
  completeBtn.addEventListener('click', () => {
    li.classList.toggle('completed');
    saveTasks();
  });

  // Bouton "Supprimer"
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.classList.add('task-btn', 'btn-delete');
  deleteBtn.textContent = 'Supprimer';
  deleteBtn.setAttribute('aria-label', `Supprimer la tâche "${text}"`);
  
  deleteBtn.addEventListener('click', () => {
    li.remove();
    saveTasks();
  });

  // Assemblage du DOM pour l'élément <li>
  actionsDiv.appendChild(completeBtn);
  actionsDiv.appendChild(deleteBtn);
  li.appendChild(spanText);
  li.appendChild(actionsDiv);

  return li;
}

/**
 * Sauvegarde l'état actuel de toutes les tâches dans le LocalStorage
 */
function saveTasks() {
  const tasks = [];
  const items = taskListEl.querySelectorAll('li');

  items.forEach((item) => {
    const textEl = item.querySelector('.task-text');
    if (textEl) {
      tasks.push({
        text: textEl.textContent,
        completed: item.classList.contains('completed')
      });
    }
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans localStorage :', error);
  }
}

/**
 * Charge les tâches sauvegardées depuis le LocalStorage et les restitue
 */
function loadTasks() {
  taskListEl.innerHTML = '';

  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return;

    const tasks = JSON.parse(savedData);
    if (Array.isArray(tasks)) {
      tasks.forEach((task) => {
        if (task && typeof task.text === 'string') {
          const taskElement = createTaskElement(task.text, Boolean(task.completed));
          taskListEl.appendChild(taskElement);
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de la lecture du localStorage :', error);
  }
}

/**
 * Ajoute une nouvelle tâche saisie par l'utilisateur
 */
function handleAddTask() {
  const taskText = taskInputEl.value.trim();

  // Vérifie que le champ n'est pas vide
  if (taskText === '') {
    taskInputEl.focus();
    return;
  }

  // Crée et ajoute l'élément à la liste
  const taskElement = createTaskElement(taskText, false);
  taskListEl.appendChild(taskElement);

  // Sauvegarde automatique
  saveTasks();

  // Réinitialisation du champ de saisie
  taskInputEl.value = '';
  taskInputEl.focus();
}

// 3. ATTACHEMENT DES ÉVÉNEMENTS
// Ajout au clic sur le bouton "Ajouter"
addTaskBtnEl.addEventListener('click', handleAddTask);

// Ajout lors de la pression sur la touche "Entrée" dans l'input
taskInputEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleAddTask();
  }
});

// 4. INITIALISATION AU CHARGEMENT DU DOM
document.addEventListener('DOMContentLoaded', () => {
  initCurrentDate();
  displayRandomQuote();
  loadTasks();
});

// Appel immédiat au cas où le script est exécuté après l'événement DOMContentLoaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initCurrentDate();
  displayRandomQuote();
  loadTasks();
}
