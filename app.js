    const DAYS_OF_WEEK = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

    // Dados Iniciais da Semana
    const initialWeekData = [
      {
        day: "Segunda-feira",
        status: "v",
        subjects: [
          {
            title: "Faculdade de Física",
            subtasks: [
              { text: "Vetores: tratamento geométrico", done: true },
              { text: "Vetores: tratamento algébrico", done: false }
            ]
          },
          {
            title: "Concurso PMAL",
            subtasks: [
              { text: "Português: Crase e Pontuação", done: false }
            ]
          }
        ]
      },
      {
        day: "Terça-feira",
        status: "v",
        subjects: [
          {
            title: "Faculdade de Física",
            subtasks: [
              { text: "Produto escalar e projeção", done: false },
              { text: "Fatoração & Apêndice A", done: false }
            ]
          }
        ]
      },
      {
        day: "Quarta-feira",
        status: "v",
        subjects: [
          {
            title: "Faculdade de Física",
            subtasks: [
              { text: "Estrutura Atômica e Tabela", done: true },
              { text: "Funções & Inversas", done: false }
            ]
          }
        ]
      },
      {
        day: "Quinta-feira",
        status: "r",
        subjects: [
          {
            title: "Faculdade de Física",
            subtasks: [
              { text: "Conjuntos e Funções", done: false }
            ]
          }
        ]
      },
      {
        day: "Sexta-feira",
        status: "v",
        subjects: [
          {
            title: "Faculdade de Física",
            subtasks: [
              { text: "Limites e Continuidade", done: false }
            ]
          }
        ]
      },
      {
        day: "Sábado",
        status: "x",
        subjects: [
          {
            title: "Revisão Geral",
            subtasks: [
              { text: "Resolução de Exercícios Stewart", done: false }
            ]
          }
        ]
      },
      {
        day: "Domingo",
        status: "x",
        subjects: [
          {
            title: "Descanso / Planejamento",
            subtasks: [
              { text: "Organização da Próxima Semana", done: false }
            ]
          }
        ]
      }
    ];

    const VALID_STATUSES = ["v", "r", "x"];
    const EVENT_CATEGORIES = {
      exam: "Prova",
      deadline: "Entrega acadêmica",
      appointment: "Compromisso",
      other: "Outro"
    };

    function toDateKey(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    function fromDateKey(dateKey) {
      const [year, month, day] = dateKey.split("-").map(Number);
      return new Date(year, month - 1, day, 12);
    }

    function addDays(date, amount) {
      const result = new Date(date);
      result.setDate(result.getDate() + amount);
      return result;
    }

    function getWeekStart(date) {
      const result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
      result.setDate(result.getDate() - result.getDay());
      return result;
    }

    let today = new Date();
    let currentWeekStart = getWeekStart(today);
    let currentWeekStartKey = toDateKey(currentWeekStart);
    let highlightedWeeklyDateKey = toDateKey(today);
    let monthlyDateWasSelected = false;
    let selectedMonth = new Date(today.getFullYear(), today.getMonth(), 1, 12);
    let selectedYear = today.getFullYear();
    let eventsCalendarYear = today.getFullYear();
    let macroViewMode = "month";
    let selectedDateKey = toDateKey(today);
    let periodStart = new Date(today.getFullYear(), today.getMonth(), 1, 12);
    let periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 12);
    let legacyWeekData = JSON.parse(localStorage.getItem('weekly_planner_data')) || initialWeekData;
    let productivityHistory = JSON.parse(localStorage.getItem('weekly_planner_history')) || {};
    let calendarEvents = JSON.parse(localStorage.getItem('calendar_events')) || [];
    const initialCalendarTasks = [
      { id: "nov-2026-questoes-janesmar", kind: "task", title: "questões janesmar", date: "2026-11-04", time: "", category: "deadline", notes: "", done: false },
      { id: "nov-2026-relatorio-janesmar", kind: "task", title: "relatório janesmar", date: "2026-11-04", time: "", category: "deadline", notes: "", done: false },
      { id: "nov-2026-trabalho-diversidade", kind: "task", title: "trabalho de diversidade", date: "2026-11-18", time: "", category: "deadline", notes: "", done: false },
      { id: "nov-2026-aprofundar-psicologia", kind: "task", title: "aprofundar psicologia", date: "2026-11-03", time: "", category: "deadline", notes: "", done: false },
      { id: "nov-2026-projeto-integrador", kind: "task", title: "projeto integrador extensionista", date: "2026-11-12", time: "", category: "deadline", notes: "", done: false },
      { id: "nov-2026-relatorio-pesquisa-extensao", kind: "task", title: "relatório pesquisa extensão", date: "2026-11-25", time: "", category: "deadline", notes: "", done: false },
      { id: "nov-2026-atividade-pesquisa-extensao", kind: "task", title: "atividade p/ casa pesquisa e extensão", date: "2026-11-12", time: "", category: "deadline", notes: "", done: false },
      { id: "nov-2026-aprofundar-astronomia", kind: "task", title: "aprofundar astronomia", date: "2026-11-05", time: "", category: "deadline", notes: "", done: false },
      { id: "nov-2026-prova-fundamentos", kind: "task", title: "prova de fundamentos", date: "2026-11-06", time: "", category: "exam", notes: "", done: false }
    ];
    const initialCalendarTasksImported = "calendar_november_2026_tasks_imported";
    if (localStorage.getItem(initialCalendarTasksImported) !== "true") {
      const missingCalendarTasks = initialCalendarTasks.filter(task =>
        !calendarEvents.some(event => event.title === task.title && event.date === task.date)
      );
      if (missingCalendarTasks.length) {
        calendarEvents.push(...missingCalendarTasks);
        localStorage.setItem('calendar_events', JSON.stringify(calendarEvents));
      }
      localStorage.setItem(initialCalendarTasksImported, "true");
    }
    const previousVersionHistory = {
      "2026-09-28": "v",
      "2026-09-29": "r",
      "2026-09-30": "v",
      "2026-10-01": "v",
      "2026-10-02": "v",
      "2026-10-03": "x",
      "2026-10-04": "x",
      "2026-10-05": "v",
      "2026-10-06": "v",
      "2026-10-07": "v",
      "2026-10-08": "x",
      "2026-10-09": "v",
      "2026-10-10": "x",
      "2026-10-11": "x",
      "2026-10-12": "x",
      "2026-10-13": "v",
      "2026-10-14": "x",
      "2026-10-15": "v",
      "2026-10-16": "v",
      "2026-10-17": "v",
      "2026-10-18": "x",
      "2026-10-19": "v",
      "2026-10-20": "v",
      "2026-10-21": "v",
      "2026-10-22": "v",
      "2026-10-23": "r",
      "2026-10-24": "x",
      "2026-10-25": "x",
      "2026-10-26": "x",
      "2026-10-27": "r",
      "2026-10-28": "r",
      "2026-10-29": "v",
      "2026-10-30": "v",
      "2026-10-31": "v"
    };
    const shouldImportPreviousVersionHistory =
      localStorage.getItem('weekly_planner_october_2026_imported') !== "true";
    if (shouldImportPreviousVersionHistory) {
      Object.assign(productivityHistory, previousVersionHistory);
    }
    let weeklySchedules = JSON.parse(localStorage.getItem('weekly_planner_schedules')) || {};
    const savedWeekStart = localStorage.getItem('weekly_planner_week_start');
    const savedWeekOrder = localStorage.getItem('weekly_planner_week_order');
    const usesLegacyMondayOrder = savedWeekOrder !== "sunday-first";

    if (savedWeekStart && (savedWeekStart !== currentWeekStartKey || usesLegacyMondayOrder)) {
      const previousWeekStart = fromDateKey(savedWeekStart);
      legacyWeekData.forEach(dayObj => {
        const dayIdx = DAYS_OF_WEEK.indexOf(dayObj.day);
        const statusDate = toDateKey(addDays(previousWeekStart, dayIdx));
        if (VALID_STATUSES.includes(dayObj.status)) {
          productivityHistory[statusDate] = dayObj.status;
        }
      });
    }

    legacyWeekData.sort((dayA, dayB) => DAYS_OF_WEEK.indexOf(dayA.day) - DAYS_OF_WEEK.indexOf(dayB.day));
    const legacyScheduleWeekKey = savedWeekStart || currentWeekStartKey;
    if (!Object.prototype.hasOwnProperty.call(weeklySchedules, legacyScheduleWeekKey)) {
      weeklySchedules[legacyScheduleWeekKey] = legacyWeekData.map(dayObj => ({
        day: dayObj.day,
        subjects: dayObj.subjects
      }));
      if (!savedWeekStart || savedWeekStart === currentWeekStartKey) {
        legacyWeekData.forEach((dayObj, dayIdx) => {
          const dateKey = toDateKey(addDays(currentWeekStart, dayIdx));
          if (VALID_STATUSES.includes(productivityHistory[dateKey])) {
            dayObj.status = productivityHistory[dateKey];
          } else if (VALID_STATUSES.includes(dayObj.status)) {
            productivityHistory[dateKey] = dayObj.status;
          }
        });
      }
    }

    Object.keys(productivityHistory).forEach(dateKey => {
      if (dateKey > toDateKey(today)) {
        delete productivityHistory[dateKey];
      }
    });

    let selectedWeekStart = currentWeekStart;
    let selectedWeekStartKey = currentWeekStartKey;
    let weekData = [];

    function createEmptyWeekData() {
      return DAYS_OF_WEEK.map(day => ({ day, status: "", subjects: [] }));
    }

    function loadWeekDataForStart(date, highlightedDate = null) {
      selectedWeekStart = getWeekStart(date);
      selectedWeekStartKey = toDateKey(selectedWeekStart);
      highlightedWeeklyDateKey = highlightedDate
        ? toDateKey(highlightedDate)
        : (toDateKey(today) >= selectedWeekStartKey
          && toDateKey(today) <= toDateKey(addDays(selectedWeekStart, 6))
          ? toDateKey(today)
          : null);
      document.getElementById('weekly-range-start').value = selectedWeekStartKey;
      document.getElementById('weekly-range-end').value = "";
      document.getElementById('weekly-range-feedback').textContent = "";
      const savedSchedule = weeklySchedules[selectedWeekStartKey];
      const scheduleByDay = new Map((savedSchedule || []).map(day => [day.day, day]));

      weekData = DAYS_OF_WEEK.map((day, dayIdx) => {
        const dateKey = toDateKey(addDays(selectedWeekStart, dayIdx));
        const schedule = scheduleByDay.get(day);
        return {
          day,
          status: VALID_STATUSES.includes(productivityHistory[dateKey])
            ? productivityHistory[dateKey]
            : "",
          subjects: schedule ? schedule.subjects : []
        };
      });

      renderWeeklyGrid();
      return selectedWeekStart;
    }

    localStorage.setItem('weekly_planner_week_start', currentWeekStartKey);
    localStorage.setItem('weekly_planner_week_order', "sunday-first");

    function syncSelectedWeekToHistory() {
      weekData.forEach((dayObj, dayIdx) => {
        const statusDate = toDateKey(addDays(selectedWeekStart, dayIdx));
        if (VALID_STATUSES.includes(dayObj.status)) {
          productivityHistory[statusDate] = dayObj.status;
        } else {
          delete productivityHistory[statusDate];
        }
      });
    }

    function saveWeekData() {
      syncSelectedWeekToHistory();
      weeklySchedules[selectedWeekStartKey] = weekData.map(dayObj => ({
        day: dayObj.day,
        subjects: dayObj.subjects
      }));
      localStorage.setItem('weekly_planner_schedules', JSON.stringify(weeklySchedules));
      localStorage.setItem('weekly_planner_data', JSON.stringify(weekData));
      localStorage.setItem('weekly_planner_history', JSON.stringify(productivityHistory));
    }

    loadWeekDataForStart(currentWeekStart);
    saveWeekData();
    if (shouldImportPreviousVersionHistory) {
      localStorage.setItem('weekly_planner_october_2026_imported', "true");
    }

    function refreshCalendarDate() {
      const currentDate = new Date();
      if (toDateKey(currentDate) === toDateKey(today)) {
        return;
      }

      const previousToday = today;
      const previousWeekStart = currentWeekStart;
      const previousWeekStartKey = currentWeekStartKey;
      const wasShowingCurrentMonth = selectedMonth.getFullYear() === previousToday.getFullYear()
        && selectedMonth.getMonth() === previousToday.getMonth();
      const nextWeekStart = getWeekStart(currentDate);
      const nextWeekStartKey = toDateKey(nextWeekStart);

      if (nextWeekStartKey !== previousWeekStartKey) {
        saveWeekData();

        currentWeekStart = nextWeekStart;
        currentWeekStartKey = nextWeekStartKey;
        localStorage.setItem('weekly_planner_week_start', currentWeekStartKey);
        if (selectedWeekStartKey === toDateKey(previousWeekStart)) {
          loadWeekDataForStart(currentWeekStart);
        }
      }

      today = currentDate;
      if (wasShowingCurrentMonth && selectedMonth.getMonth() !== today.getMonth()) {
        selectedMonth = new Date(today.getFullYear(), today.getMonth(), 1, 12);
      }
      renderWeeklyGrid();
      renderMacro();
    }

    setInterval(refreshCalendarDate, 60 * 1000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        refreshCalendarDate();
      }
    });

    function renderWeeklyGrid() {
      const grid = document.getElementById('weekly-grid');
      grid.innerHTML = '';
      const selectedWeekEnd = addDays(selectedWeekStart, 6);
      const formatWeekDate = date => date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
      document.getElementById('weekly-date-picker').value = selectedWeekStartKey;
      document.getElementById('weekly-week-label').textContent = `até ${formatWeekDate(selectedWeekEnd)}`;
      weekData.forEach((dayObj, dayIdx) => {
        const card = document.createElement('div');
        card.id = `weekly-day-${dayIdx}`;
        card.tabIndex = -1;
        const dayDate = addDays(selectedWeekStart, dayIdx);
        const dayDateKey = toDateKey(dayDate);
        const isToday = dayDateKey === toDateKey(today);
        const isSelectedDate = dayDateKey === highlightedWeeklyDateKey;
        card.className = `day-card${isToday ? ' is-today' : ''}${isSelectedDate ? ' is-selected-date' : ''}`;
        const dateLabel = isToday
          ? `<span class="day-date is-today">Hoje</span>`
          : `<span class="day-date">${dayDate.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit"
            })}</span>`;
        const dayItems = calendarEvents
          .filter(item => item.date === dayDateKey
            && (item.kind === "task" || item.kind === "appointment"))
          .sort((a, b) => (a.time || "").localeCompare(b.time || "") || a.title.localeCompare(b.title));
        const dayItemsHtml = dayItems.length
          ? `<section class="day-planning-items" aria-label="Tarefas e compromissos">
              <h4 class="day-planning-title">Tarefas e compromissos</h4>
              ${dayItems.map(item => item.kind === "task"
                ? `<div class="day-planning-item day-planning-task${item.done ? " is-completed" : ""}">
                    <label class="day-planning-task-label">
                      <input type="checkbox" data-toggle-planning-task="${escapeHtml(item.id)}" ${item.done ? "checked" : ""}>
                      <span>${escapeHtml(item.title)}</span>
                    </label>
                    <div class="day-planning-item-actions">
                      <button class="day-planning-item-action" type="button" data-edit-planning-item="${escapeHtml(item.id)}" aria-label="Editar tarefa ${escapeHtml(item.title)}" title="Editar">✎</button>
                      <button class="day-planning-item-action" type="button" data-delete-planning-item="${escapeHtml(item.id)}" aria-label="Excluir tarefa ${escapeHtml(item.title)}" title="Excluir">×</button>
                    </div>
                  </div>`
                : `<div class="day-planning-item day-planning-appointment">
                    <span class="day-planning-item-time">${item.time ? `${escapeHtml(item.time)} · ` : ""}</span>
                    <span class="day-planning-item-name">${escapeHtml(item.title)}</span>
                    <div class="day-planning-item-actions">
                      <button class="day-planning-item-action" type="button" data-edit-planning-item="${escapeHtml(item.id)}" aria-label="Editar compromisso ${escapeHtml(item.title)}" title="Editar">✎</button>
                      <button class="day-planning-item-action" type="button" data-delete-planning-item="${escapeHtml(item.id)}" aria-label="Excluir compromisso ${escapeHtml(item.title)}" title="Excluir">×</button>
                    </div>
                  </div>`
              ).join("")}
            </section>`
          : "";

        // Cabeçalho do Dia
        let html = `
          <div class="day-header">
            <h3 class="day-title">${dayObj.day}</h3>
            ${dateLabel}
          </div>
          <div class="subjects-container" id="subjects-day-${dayIdx}">
        `;

        // Tópicos Principais
        dayObj.subjects.forEach((subj, subjIdx) => {
          html += `
            <div class="subject-block">
              <div class="subject-header">
                <input type="text" class="subject-title-input" value="${escapeHtml(subj.title)}" onchange="updateSubjectTitle(${dayIdx}, ${subjIdx}, this.value)" placeholder="Título da Matéria...">
                <button class="btn-remove-subject" onclick="removeSubject(${dayIdx}, ${subjIdx})" title="Remover Matéria">&times;</button>
              </div>
              <div class="subtask-list">
          `;

          // Subtópicos
          subj.subtasks.forEach((sub, subIdx) => {
            html += `
              <div class="subtask-item ${sub.done ? 'completed' : ''}">
                <input type="checkbox" class="subtask-checkbox" ${sub.done ? 'checked' : ''} onchange="toggleSubtask(${dayIdx}, ${subjIdx}, ${subIdx})">
                <input type="text" class="subtask-text-input" value="${escapeHtml(sub.text)}" onchange="updateSubtaskText(${dayIdx}, ${subjIdx}, ${subIdx}, this.value)" placeholder="Descreva o subtópico...">
                <button class="btn-remove-subtask" onclick="removeSubtask(${dayIdx}, ${subjIdx}, ${subIdx})" title="Remover Subtópico">&times;</button>
              </div>
            `;
          });

          html += `
              </div>
              ${subj.subtasks.length < 10 ? `<button class="btn-add-subtask" onclick="addSubtask(${dayIdx}, ${subjIdx})">+ Adicionar Subtópico</button>` : ''}
            </div>
          `;
        });

        html += `</div>`;

        // Botão para adicionar Tópico Principal (máximo 5)
        if (dayObj.subjects.length < 5) {
          html += `<button class="btn-add-main-subject" onclick="addSubject(${dayIdx})">+ Adicionar Tópico Principal</button>`;
        }

        html += `
          ${dayItemsHtml}
          <div class="day-planning-add-actions">
            <button class="btn-add-planning-item" type="button" data-add-planning-item="task" data-planning-date="${dayDateKey}">+ Adicionar tarefa</button>
            <button class="btn-add-planning-item" type="button" data-add-planning-item="appointment" data-planning-date="${dayDateKey}">+ Adicionar compromisso</button>
          </div>
        `;

        // Seletor Circular de Status do Dia
        html += `
          <div class="status-circles-container">
            <span class="status-label">Status do Dia</span>
            <div class="status-circles">
              <button class="circle-btn circle-v ${dayObj.status === 'v' ? 'active' : ''}" onclick="setStatus(${dayIdx}, 'v')" ${isToday ? '' : 'disabled'} aria-label="Marcar dia como positivo" title="${isToday ? 'Status de hoje' : 'Somente o status de hoje pode ser alterado'}">V</button>
              <button class="circle-btn circle-r ${dayObj.status === 'r' ? 'active' : ''}" onclick="setStatus(${dayIdx}, 'r')" ${isToday ? '' : 'disabled'} aria-label="Marcar dia como ruim" title="${isToday ? 'Status de hoje' : 'Somente o status de hoje pode ser alterado'}">R</button>
              <button class="circle-btn circle-x ${dayObj.status === 'x' ? 'active' : ''}" onclick="setStatus(${dayIdx}, 'x')" ${isToday ? '' : 'disabled'} aria-label="Marcar dia como inativo" title="${isToday ? 'Status de hoje' : 'Somente o status de hoje pode ser alterado'}">X</button>
            </div>
          </div>
        `;

        card.innerHTML = html;
        grid.appendChild(card);
      });
    }

    function getProductivityStats() {
      const todayKey = toDateKey(new Date());
      const recordedStatuses = Object.entries(productivityHistory)
        .filter(([dateKey, status]) => dateKey <= todayKey && VALID_STATUSES.includes(status))
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB));

      let bestStreak = 0;
      let streak = 0;
      let previousDate = null;
      let productiveDays = 0;

      recordedStatuses.forEach(([dateKey, status]) => {
        if (status === "v") {
          productiveDays += 1;
        }

        const isConsecutive = previousDate
          && addDays(fromDateKey(previousDate), 1).getTime() === fromDateKey(dateKey).getTime();
        if (status === "v" || status === "x") {
          streak = isConsecutive ? streak + 1 : 1;
          bestStreak = Math.max(bestStreak, streak);
        } else {
          streak = 0;
        }
        previousDate = dateKey;
      });

      const todayStatus = productivityHistory[todayKey];
      let streakDate = fromDateKey(todayKey);
      if (todayStatus === "r") {
        streakDate = null;
      } else if (!VALID_STATUSES.includes(todayStatus)) {
        streakDate = addDays(streakDate, -1);
      }

      let currentStreak = 0;
      while (streakDate) {
        const status = productivityHistory[toDateKey(streakDate)];
        if (status !== "v" && status !== "x") {
          break;
        }
        currentStreak += 1;
        streakDate = addDays(streakDate, -1);
      }

      return { currentStreak, bestStreak, productiveDays, todayKey };
    }

    function formatDayCount(count) {
      return `${count} ${count === 1 ? "dia" : "dias"}`;
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]);
    }

    function renderEventsCalendar() {
      document.getElementById('events-year-label').textContent = String(eventsCalendarYear);
      document.getElementById('events-calendar').innerHTML = Array.from({ length: 12 }, (_, monthIndex) => {
        const monthStart = new Date(eventsCalendarYear, monthIndex, 1, 12);
        const monthKey = `${eventsCalendarYear}-${String(monthIndex + 1).padStart(2, "0")}`;
        const daysInMonth = new Date(eventsCalendarYear, monthIndex + 1, 0).getDate();
        const monthEvents = calendarEvents.filter(item => item.date.startsWith(monthKey));
        const days = Array.from({ length: 31 }, (_, dayIndex) => {
          const day = dayIndex + 1;
          if (day > daysInMonth) {
            return `<div class="events-day events-day-empty" aria-hidden="true"></div>`;
          }

          const date = new Date(eventsCalendarYear, monthIndex, day, 12);
          const dateKey = toDateKey(date);
          const isToday = dateKey === toDateKey(today);
          const dayEvents = monthEvents
            .filter(item => item.date === dateKey)
            .sort((a, b) => (a.time || "").localeCompare(b.time || "") || a.title.localeCompare(b.title));
          const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
          const eventCards = dayEvents.map(item => {
            const category = Object.prototype.hasOwnProperty.call(EVENT_CATEGORIES, item.category)
              ? item.category
              : "other";
            const kindLabel = item.kind === "task"
              ? (item.done ? "Tarefa concluída" : "Tarefa")
              : item.kind === "appointment"
                ? "Compromisso"
                : EVENT_CATEGORIES[category];
            return `
              <button class="event-card event-category-${category}${item.done ? " is-completed" : ""}" type="button" data-event-id="${escapeHtml(item.id)}" title="${escapeHtml(item.notes || item.title)}">
                ${item.time ? `<time>${escapeHtml(item.time)}</time>` : ""}
                <small class="event-card-kind">${kindLabel}</small>
                <span>${escapeHtml(item.title)}</span>
              </button>
            `;
          }).join("");

          return `
            <div class="events-day${isToday ? " is-today" : ""}" data-event-date="${dateKey}">
              <button class="events-day-add" type="button" aria-label="Adicionar evento em ${date.toLocaleDateString("pt-BR")}">
                <span class="events-day-weekday">${weekday}</span>
                <span class="events-day-number">${day}</span>
                <span class="events-day-add-icon" aria-hidden="true">+</span>
              </button>
              <div class="events-day-items">${eventCards}</div>
            </div>
          `;
        }).join("");

        return `
          <section class="events-month-row" data-events-month="${monthIndex}" aria-label="${monthStart.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}">
            <h3 class="events-month-name">${monthStart.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</h3>
            <div class="events-month-days">${days}</div>
          </section>
        `;
      }).join("");
    }

    function positionEventsCalendarAtCurrentMonth() {
      const monthIndex = eventsCalendarYear === today.getFullYear() ? today.getMonth() : 0;
      const month = document.querySelector(`[data-events-month="${monthIndex}"]`);
      if (!month) {
        return;
      }

      const scrollContainer = document.getElementById('events-calendar-scroll');
      const calendar = document.getElementById('events-calendar');
      calendar.style.paddingBottom = "0px";
      const monthOffset = month.offsetTop - calendar.offsetTop;
      const contentAfterMonth = calendar.scrollHeight - monthOffset;
      const extraScrollSpace = Math.max(0, scrollContainer.clientHeight - contentAfterMonth);
      calendar.style.paddingBottom = `${extraScrollSpace}px`;
      const monthTop = month.getBoundingClientRect().top;
      const containerTop = scrollContainer.getBoundingClientRect().top;
      scrollContainer.scrollTop += monthTop - containerTop;
    }

    function openEventDialog(dateKey = toDateKey(today), event = null) {
      openPlanningItemDialog(dateKey, "event", event);
    }

    function openPlanningItemDialog(dateKey = toDateKey(today), kind = "task", event = null) {
      const form = document.getElementById('event-form');
      form.reset();
      document.getElementById('event-id').value = event ? event.id : "";
      document.getElementById('event-kind').value = event ? (event.kind || "event") : kind;
      document.getElementById('event-title').value = event ? event.title : "";
      document.getElementById('event-date').value = event ? event.date : dateKey;
      document.getElementById('event-time').value = event ? event.time || "" : "";
      document.getElementById('event-category').value = event
        ? event.category
        : kind === "task"
          ? "deadline"
          : kind === "appointment"
            ? "appointment"
            : "exam";
      document.getElementById('event-notes').value = event ? event.notes || "" : "";
      document.getElementById('event-dialog-title').textContent = event
        ? `Editar ${event.kind === "task" ? "tarefa" : event.kind === "appointment" ? "compromisso" : "evento"}`
        : `Novo ${kind === "task" ? "tarefa" : kind === "appointment" ? "compromisso" : "evento"}`;
      document.getElementById('delete-calendar-event').hidden = !event;
      document.getElementById('event-dialog').showModal();
      document.getElementById('event-title').focus();
    }

    function saveCalendarEvents() {
      localStorage.setItem('calendar_events', JSON.stringify(calendarEvents));
      renderEventsCalendar();
      renderWeeklyGrid();
      renderMacro();
    }

    function getVisibleDateRange() {
      if (macroViewMode === "year") {
        return [
          new Date(selectedYear, 0, 1, 12),
          new Date(selectedYear, 11, 31, 12)
        ];
      }
      if (macroViewMode === "period") {
        return [periodStart, periodEnd];
      }

      const start = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1, 12);
      return [start, new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0, 12)];
    }

    function renderCalendarMonth(year, month, compact = false, rangeStart = null, rangeEnd = null) {
      const monthStart = new Date(year, month, 1, 12);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const headings = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
        .map(day => `<span class="calendar-weekday">${day}</span>`)
        .join("");
      const blanks = Array.from({ length: monthStart.getDay() }, () =>
        `<span class="calendar-day-spacer" aria-hidden="true"></span>`
      ).join("");
      const dates = Array.from({ length: daysInMonth }, (_, index) => {
        const date = addDays(monthStart, index);
        const dateKey = toDateKey(date);
        const outsideRange = (rangeStart && dateKey < toDateKey(rangeStart))
          || (rangeEnd && dateKey > toDateKey(rangeEnd));
        if (outsideRange) {
          return `<span class="calendar-day-spacer" aria-hidden="true"></span>`;
        }

        const status = VALID_STATUSES.includes(productivityHistory[dateKey])
          ? productivityHistory[dateKey]
          : "";
        const statusLabel = {
          v: "Produtivo",
          r: "Dia ruim",
          x: "Dia inativo"
        }[status] || "Sem registro";
        const todayClass = dateKey === toDateKey(today) ? " is-today" : "";
        const selectedClass = dateKey === selectedDateKey ? " is-selected" : "";
        const futureClass = dateKey > toDateKey(today) ? " is-future" : "";
        const weekSchedule = weeklySchedules[toDateKey(getWeekStart(date))] || [];
        const dayPlan = weekSchedule.find(day => day.day === DAYS_OF_WEEK[date.getDay()]);
        const hasPlannedActivities = Boolean(dayPlan && dayPlan.subjects.length > 0);
        const dateEvents = calendarEvents.filter(item => item.date === dateKey);
        const hasPlanningItems = dateEvents.some(item => item.kind === "task" || item.kind === "appointment");
        const hasActivities = hasPlannedActivities || dateEvents.length > 0;
        const activitiesClass = hasActivities ? " has-activities" : "";
        const planningItemsClass = hasPlanningItems ? " has-planning-items" : "";
        const activityDescription = [
          hasPlannedActivities ? "Há estudos planejados." : "",
          dateEvents.filter(item => item.kind === "task").length
            ? `${dateEvents.filter(item => item.kind === "task").length} tarefa(s).`
            : "",
          dateEvents.filter(item => item.kind === "appointment").length
            ? `${dateEvents.filter(item => item.kind === "appointment").length} compromisso(s).`
            : "",
          dateEvents.some(item => item.kind !== "task" && item.kind !== "appointment")
            ? "Há eventos agendados."
            : ""
        ].filter(Boolean).join(" ");
        const dateLabel = date.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        });

        return `
          <button class="calendar-day${todayClass}${selectedClass}${futureClass}${activitiesClass}${planningItemsClass}" type="button" data-calendar-date="${dateKey}" title="${dateLabel}${hasActivities ? `: ${activityDescription}` : ""} Status: ${statusLabel}" aria-label="Ver atividades de ${dateLabel}.${hasActivities ? ` ${activityDescription}` : " Sem atividades planejadas."} Status: ${statusLabel}" aria-pressed="${dateKey === selectedDateKey}">
            <span class="calendar-date">${index + 1}</span>
            ${dateKey === toDateKey(today) ? '<span class="calendar-today-label">Hoje</span>' : ''}
            <span class="month-status-dot${status ? ` status-${status}` : ""}" aria-hidden="true">${status ? status.toUpperCase() : "·"}</span>
          </button>
        `;
      }).join("");
      const title = compact
        ? `<h3>${monthStart.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</h3>`
        : "";

      return `${title}<div class="month-calendar-grid">${headings}${blanks}${dates}</div>`;
    }

    function renderSelectedDayDetails() {
      const date = fromDateKey(selectedDateKey);
      const dateLabel = date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      const dayIndex = date.getDay();
      const dateWeekKey = toDateKey(getWeekStart(date));
      const dateWeekSchedule = weeklySchedules[dateWeekKey] || [];
      const dayPlan = dateWeekSchedule.find(day => day.day === DAYS_OF_WEEK[dayIndex]);
      const status = productivityHistory[selectedDateKey];
      const statusLabel = {
        v: "V · Produtivo",
        r: "R · Dia ruim",
        x: "X · Dia inativo"
      }[status] || "Sem status registrado";
      const statusClass = VALID_STATUSES.includes(status) ? ` status-${status}` : "";
      const dateItems = calendarEvents
        .filter(item => item.date === selectedDateKey)
        .sort((a, b) => (a.time || "").localeCompare(b.time || "") || a.title.localeCompare(b.title));
      let subjectsHtml = `<p class="day-details-empty">Não há atividades planejadas para este dia da semana.</p>`;
      let dateItemsHtml = `<p class="day-details-empty">Não há tarefas, compromissos ou eventos nesta data.</p>`;

      if (dayPlan && dayPlan.subjects.length) {
        subjectsHtml = `<div class="planned-subjects">${dayPlan.subjects.map(subject => `
          <article class="planned-subject">
            <h4>${escapeHtml(subject.title || "Tópico sem título")}</h4>
            ${subject.subtasks.length
              ? `<ul>${subject.subtasks.map(subtask => `
                  <li class="${subtask.done ? "planned-subtask-done" : ""}">${escapeHtml(subtask.text || "Subtópico sem descrição")}</li>
                `).join("")}</ul>`
              : `<p class="day-details-empty">Sem subtópicos planejados.</p>`}
          </article>
        `).join("")}</div>`;
      }

      if (dateItems.length) {
        dateItemsHtml = `<ul class="day-details-calendar-items">${dateItems.map(item => `
          <li class="${item.done ? "is-completed" : ""}">
            <span class="day-details-item-kind">${item.kind === "task" ? "Tarefa" : item.kind === "appointment" ? "Compromisso" : EVENT_CATEGORIES[item.category] || "Evento"}</span>
            ${item.time ? `<time>${escapeHtml(item.time)}</time>` : ""}
            <span class="day-details-item-name">${escapeHtml(item.title)}</span>
            ${item.done ? '<span class="day-details-item-completed">Concluída</span>' : ""}
          </li>
        `).join("")}</ul>`;
      }

      document.getElementById('day-details').innerHTML = `
        <div class="day-details-header">
          <h3 id="day-details-title">Atividades de ${escapeHtml(dateLabel)}</h3>
          <span class="day-details-status${statusClass}">${statusLabel}</span>
        </div>
        <h4 class="day-details-section-title">Cronograma de estudos</h4>
        ${subjectsHtml}
        <h4 class="day-details-section-title">Tarefas, compromissos e eventos</h4>
        ${dateItemsHtml}
        <div class="day-details-actions">
          <button class="view-action-button" type="button" id="edit-selected-day">Editar planejamento desta semana →</button>
        </div>
      `;
    }

    function renderDayPreview(dateKey) {
      const date = fromDateKey(dateKey);
      const dateLabel = date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      const dayIndex = date.getDay();
      const schedule = weeklySchedules[toDateKey(getWeekStart(date))] || [];
      const dayPlan = schedule.find(day => day.day === DAYS_OF_WEEK[dayIndex]);
      const status = productivityHistory[dateKey];
      const statusLabel = {
        v: "V · Produtivo",
        r: "R · Dia ruim",
        x: "X · Dia inativo"
      }[status] || "Sem registro";
      const statusClass = VALID_STATUSES.includes(status) ? ` status-${status}` : "";
      const dateItems = calendarEvents
        .filter(item => item.date === dateKey)
        .sort((a, b) => (a.time || "").localeCompare(b.time || "") || a.title.localeCompare(b.title));
      const subjectsHtml = dayPlan && dayPlan.subjects.length
        ? `<div class="day-preview-subjects">${dayPlan.subjects.map(subject => `
            <article>
              <strong>${escapeHtml(subject.title || "Tópico sem título")}</strong>
              ${subject.subtasks.length
                ? `<ul>${subject.subtasks.map(subtask => `
                    <li class="${subtask.done ? "planned-subtask-done" : ""}">${escapeHtml(subtask.text || "Subtópico sem descrição")}</li>
                  `).join("")}</ul>`
                : ""}
            </article>
          `).join("")}</div>`
        : `<p class="day-details-empty">Sem estudos planejados.</p>`;
      const itemsHtml = dateItems.length
        ? `<ul class="day-preview-items">${dateItems.map(item => `
            <li class="${item.done ? "is-completed" : ""}">
              <span class="day-details-item-kind">${item.kind === "task" ? "Tarefa" : item.kind === "appointment" ? "Compromisso" : EVENT_CATEGORIES[item.category] || "Evento"}</span>
              ${item.time ? `<time>${escapeHtml(item.time)}</time>` : ""}
              <span class="day-details-item-name">${escapeHtml(item.title)}</span>
              ${item.done ? '<span class="day-details-item-completed">Concluída</span>' : ""}
            </li>
          `).join("")}</ul>`
        : `<p class="day-details-empty">Sem tarefas, compromissos ou eventos.</p>`;

      return `
        <div class="day-preview-header">
          <h3>Atividades de ${escapeHtml(dateLabel)}</h3>
          <span class="day-details-status${statusClass}">${statusLabel}</span>
        </div>
        <h4 class="day-details-section-title">Cronograma de estudos</h4>
        ${subjectsHtml}
        <h4 class="day-details-section-title">Tarefas, compromissos e eventos</h4>
        ${itemsHtml}
      `;
    }

    const dayPreview = document.getElementById('day-preview');
    let dayPreviewTimer = null;
    let touchPreviewPointerId = null;

    function hideDayPreview() {
      window.clearTimeout(dayPreviewTimer);
      dayPreview.hidden = true;
      dayPreview.removeAttribute('style');
    }

    function showDayPreview(dateKey, anchor) {
      window.clearTimeout(dayPreviewTimer);
      document.getElementById('day-preview-content').innerHTML = renderDayPreview(dateKey);
      dayPreview.hidden = false;
      const anchorRect = anchor.getBoundingClientRect();
      const previewRect = dayPreview.getBoundingClientRect();
      const margin = 12;
      const left = Math.max(margin, Math.min(
        anchorRect.left + anchorRect.width / 2 - previewRect.width / 2,
        window.innerWidth - previewRect.width - margin
      ));
      const top = anchorRect.bottom + previewRect.height + margin <= window.innerHeight
        ? anchorRect.bottom + 8
        : Math.max(margin, anchorRect.top - previewRect.height - 8);
      dayPreview.style.left = `${left}px`;
      dayPreview.style.top = `${top}px`;
    }

    function scheduleDayPreview(dateKey, anchor, delay = 220) {
      window.clearTimeout(dayPreviewTimer);
      dayPreviewTimer = window.setTimeout(() => showDayPreview(dateKey, anchor), delay);
    }

    function renderMacro() {
      hideDayPreview();
      const stats = getProductivityStats();
      document.getElementById('streak-count').textContent = `${formatDayCount(stats.currentStreak)} de sequência atual`;

      document.querySelectorAll('[data-macro-mode]').forEach(button => {
        const isActive = button.dataset.macroMode === macroViewMode;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
      document.getElementById('month-controls').hidden = macroViewMode !== "month";
      document.getElementById('year-controls').hidden = macroViewMode !== "year";
      document.getElementById('period-controls').hidden = macroViewMode !== "period";
      document.getElementById('month-label').textContent = selectedMonth.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
      });
      document.getElementById('year-label').textContent = String(selectedYear);
      document.getElementById('period-start').value = toDateKey(periodStart);
      document.getElementById('period-end').value = toDateKey(periodEnd);

      const [rangeStart, rangeEnd] = getVisibleDateRange();
      const counts = { v: 0, r: 0, x: 0 };
      let rangeDayCount = 0;
      for (let date = new Date(rangeStart); date <= rangeEnd; date = addDays(date, 1)) {
        rangeDayCount += 1;
        const status = productivityHistory[toDateKey(date)];
        if (VALID_STATUSES.includes(status)) {
          counts[status] += 1;
        }
      }
      const positivePercentage = rangeDayCount
        ? new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format((counts.v / rangeDayCount) * 100)
        : "0,00";
      const rangeLabel = macroViewMode === "month" ? "no mês" : macroViewMode === "year" ? "no ano" : "no período";
      document.getElementById('macro-stat-grid').innerHTML = `
        <article class="macro-stat-card">
          <span class="macro-stat-label">Sequência atual</span>
          <strong class="macro-stat-value">${formatDayCount(stats.currentStreak)}</strong>
          <span class="macro-stat-detail">Dias sem status R</span>
        </article>
        <article class="macro-stat-card">
          <span class="macro-stat-label">Recorde histórico</span>
          <strong class="macro-stat-value">${formatDayCount(stats.bestStreak)}</strong>
          <span class="macro-stat-detail">Maior sequência sem dias ruins (R)</span>
        </article>
        <article class="macro-stat-card">
          <span class="macro-stat-label">Dias positivos ${rangeLabel}</span>
          <strong class="macro-stat-value">${counts.v}</strong>
          <span class="macro-stat-detail">Dias marcados com V</span>
        </article>
        <article class="macro-stat-card">
          <span class="macro-stat-label">Dias ruins ${rangeLabel}</span>
          <strong class="macro-stat-value">${counts.r}</strong>
          <span class="macro-stat-detail">Dias marcados com R</span>
        </article>
        <article class="macro-stat-card">
          <span class="macro-stat-label">Dias inativos ${rangeLabel}</span>
          <strong class="macro-stat-value">${counts.x}</strong>
          <span class="macro-stat-detail">Dias marcados com X</span>
        </article>
        <article class="macro-stat-card">
          <span class="macro-stat-label">Percentual de dias positivos ${rangeLabel}</span>
          <strong class="macro-stat-value">${positivePercentage}%</strong>
          <span class="macro-stat-detail">${counts.v} de ${rangeDayCount} dias do intervalo</span>
        </article>
      `;

      const calendarTarget = document.getElementById('calendar-view-target');
      if (macroViewMode === "month") {
        calendarTarget.innerHTML = renderCalendarMonth(selectedMonth.getFullYear(), selectedMonth.getMonth());
      } else if (macroViewMode === "year") {
        calendarTarget.innerHTML = `<div class="annual-months-grid">${Array.from({ length: 12 }, (_, month) => `
          <article class="annual-month-card">${renderCalendarMonth(selectedYear, month, true)}</article>
        `).join("")}</div>`;
      } else {
        const months = [];
        let year = periodStart.getFullYear();
        let month = periodStart.getMonth();
        while (year < periodEnd.getFullYear() || (year === periodEnd.getFullYear() && month <= periodEnd.getMonth())) {
          months.push(`<article class="period-month-card">${renderCalendarMonth(year, month, true, periodStart, periodEnd)}</article>`);
          month += 1;
          if (month > 11) {
            month = 0;
            year += 1;
          }
        }
        calendarTarget.innerHTML = `<div class="period-months-grid">${months.join("")}</div>`;
      }

      renderSelectedDayDetails();
    }

    let lastCalendarClick = null;
    const calendarViewTarget = document.getElementById('calendar-view-target');
    calendarViewTarget.addEventListener('pointerover', event => {
      if (event.pointerType === "touch") {
        return;
      }
      const dayButton = event.target.closest('[data-calendar-date]');
      if (dayButton && !dayButton.contains(event.relatedTarget)) {
        scheduleDayPreview(dayButton.dataset.calendarDate, dayButton);
      }
    });
    calendarViewTarget.addEventListener('pointerout', event => {
      const dayButton = event.target.closest('[data-calendar-date]');
      if (dayButton && !dayButton.contains(event.relatedTarget) && !dayPreview.contains(event.relatedTarget)) {
        window.clearTimeout(dayPreviewTimer);
        dayPreviewTimer = window.setTimeout(hideDayPreview, 180);
      }
    });
    calendarViewTarget.addEventListener('focusin', event => {
      const dayButton = event.target.closest('[data-calendar-date]');
      if (dayButton) {
        scheduleDayPreview(dayButton.dataset.calendarDate, dayButton, 0);
      }
    });
    calendarViewTarget.addEventListener('focusout', event => {
      const dayButton = event.target.closest('[data-calendar-date]');
      if (dayButton && !dayButton.contains(event.relatedTarget) && !dayPreview.contains(event.relatedTarget)) {
        window.clearTimeout(dayPreviewTimer);
        dayPreviewTimer = window.setTimeout(hideDayPreview, 180);
      }
    });
    calendarViewTarget.addEventListener('pointerdown', event => {
      touchPreviewPointerId = event.pointerType === "touch"
        ? event.pointerId
        : null;
    });
    calendarViewTarget.addEventListener('click', event => {
      const dayButton = event.target.closest('[data-calendar-date]');
      if (!dayButton) {
        return;
      }
      const dateKey = dayButton.dataset.calendarDate;
      const shouldShowTouchPreview = touchPreviewPointerId !== null;
      touchPreviewPointerId = null;
      const clickTime = Date.now();
      if (lastCalendarClick
        && lastCalendarClick.dateKey === dateKey
        && clickTime - lastCalendarClick.clickTime < 500) {
        lastCalendarClick = null;
        monthlyDateWasSelected = true;
        navigateToWeeklyDate(dateKey);
        return;
      }

      lastCalendarClick = { dateKey, clickTime };
      monthlyDateWasSelected = true;
      selectedDateKey = dateKey;
      renderMacro();
      if (shouldShowTouchPreview) {
        const selectedDayButton = calendarViewTarget.querySelector(`[data-calendar-date="${dateKey}"]`);
        if (selectedDayButton) {
          showDayPreview(dateKey, selectedDayButton);
        }
      }
    });
    dayPreview.addEventListener('pointerenter', () => {
      window.clearTimeout(dayPreviewTimer);
    });
    dayPreview.addEventListener('pointerleave', event => {
      if (!calendarViewTarget.contains(event.relatedTarget)) {
        dayPreviewTimer = window.setTimeout(hideDayPreview, 180);
      }
    });
    dayPreview.addEventListener('focusout', event => {
      if (!dayPreview.contains(event.relatedTarget) && !calendarViewTarget.contains(event.relatedTarget)) {
        dayPreviewTimer = window.setTimeout(hideDayPreview, 180);
      }
    });
    document.getElementById('close-day-preview').addEventListener('click', hideDayPreview);
    document.addEventListener('pointerdown', event => {
      if (!dayPreview.contains(event.target) && !calendarViewTarget.contains(event.target)) {
        hideDayPreview();
      }
    });

    document.querySelectorAll('[data-macro-mode]').forEach(button => {
      button.addEventListener('click', () => {
        macroViewMode = button.dataset.macroMode;
        if (macroViewMode === "year" && Number(selectedDateKey.slice(0, 4)) !== selectedYear) {
          selectedDateKey = `${selectedYear}-01-01`;
        }
        if (macroViewMode === "period"
          && (selectedDateKey < toDateKey(periodStart) || selectedDateKey > toDateKey(periodEnd))) {
          selectedDateKey = toDateKey(periodStart);
        }
        if (macroViewMode === "month"
          && selectedDateKey.slice(0, 7) !== `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}`) {
          selectedDateKey = toDateKey(selectedMonth);
        }
        renderMacro();
      });
    });

    document.getElementById('previous-month').addEventListener('click', () => {
      selectedMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1, 12);
      selectedDateKey = toDateKey(selectedMonth);
      renderMacro();
    });

    document.getElementById('next-month').addEventListener('click', () => {
      selectedMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1, 12);
      selectedDateKey = toDateKey(selectedMonth);
      renderMacro();
    });

    document.getElementById('current-month').addEventListener('click', () => {
      selectedMonth = new Date(today.getFullYear(), today.getMonth(), 1, 12);
      selectedDateKey = toDateKey(today);
      renderMacro();
    });

    document.getElementById('previous-year').addEventListener('click', () => {
      selectedYear -= 1;
      selectedDateKey = `${selectedYear}-01-01`;
      renderMacro();
    });

    document.getElementById('next-year').addEventListener('click', () => {
      selectedYear += 1;
      selectedDateKey = `${selectedYear}-01-01`;
      renderMacro();
    });

    document.getElementById('current-year').addEventListener('click', () => {
      selectedYear = today.getFullYear();
      selectedDateKey = toDateKey(today);
      renderMacro();
    });

    document.getElementById('previous-events-year').addEventListener('click', () => {
      eventsCalendarYear -= 1;
      renderEventsCalendar();
      positionEventsCalendarAtCurrentMonth();
    });

    document.getElementById('next-events-year').addEventListener('click', () => {
      eventsCalendarYear += 1;
      renderEventsCalendar();
      positionEventsCalendarAtCurrentMonth();
    });

    document.getElementById('current-events-year').addEventListener('click', () => {
      eventsCalendarYear = today.getFullYear();
      renderEventsCalendar();
      positionEventsCalendarAtCurrentMonth();
    });

    document.getElementById('add-calendar-event').addEventListener('click', () => {
      openEventDialog();
    });

    document.getElementById('events-calendar').addEventListener('click', event => {
      if (suppressNextEventsCalendarClick) {
        suppressNextEventsCalendarClick = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const eventButton = event.target.closest('[data-event-id]');
      if (eventButton) {
        const calendarEvent = calendarEvents.find(item => item.id === eventButton.dataset.eventId);
        if (calendarEvent) {
          openEventDialog(calendarEvent.date, calendarEvent);
        }
        return;
      }

      const dateButton = event.target.closest('[data-event-date]');
      if (dateButton) {
        openEventDialog(dateButton.dataset.eventDate);
      }
    });

    document.getElementById('weekly-grid').addEventListener('click', event => {
      const addButton = event.target.closest('[data-add-planning-item]');
      if (addButton) {
        openPlanningItemDialog(addButton.dataset.planningDate, addButton.dataset.addPlanningItem);
        return;
      }

      const editButton = event.target.closest('[data-edit-planning-item]');
      if (editButton) {
        const planningItem = calendarEvents.find(item => item.id === editButton.dataset.editPlanningItem);
        if (planningItem) {
          openPlanningItemDialog(planningItem.date, planningItem.kind, planningItem);
        }
        return;
      }

      const deleteButton = event.target.closest('[data-delete-planning-item]');
      if (deleteButton) {
        const planningItem = calendarEvents.find(item => item.id === deleteButton.dataset.deletePlanningItem);
        if (!planningItem || !window.confirm(`Excluir "${planningItem.title}"?`)) {
          return;
        }
        calendarEvents = calendarEvents.filter(item => item.id !== planningItem.id);
        saveCalendarEvents();
      }
    });

    document.getElementById('weekly-grid').addEventListener('change', event => {
      const checkbox = event.target.closest('[data-toggle-planning-task]');
      if (!checkbox) {
        return;
      }

      const planningItem = calendarEvents.find(item => item.id === checkbox.dataset.togglePlanningTask);
      if (!planningItem || planningItem.kind !== "task") {
        return;
      }
      planningItem.done = checkbox.checked;
      saveCalendarEvents();
    });

    const eventsCalendarScroll = document.getElementById('events-calendar-scroll');
    let activeEventsCalendarDrag = null;
    let suppressNextEventsCalendarClick = false;

    function startEventsCalendarDrag(clientX, clientY, target) {
      if (target.closest('dialog')) {
        return;
      }

      activeEventsCalendarDrag = {
        startX: clientX,
        startY: clientY,
        startScrollLeft: eventsCalendarScroll.scrollLeft,
        startScrollTop: eventsCalendarScroll.scrollTop,
        axis: null,
        moved: false
      };
    }

    function moveEventsCalendarDrag(clientX, clientY, event) {
      if (!activeEventsCalendarDrag) {
        return;
      }

      const distanceX = clientX - activeEventsCalendarDrag.startX;
      const distanceY = clientY - activeEventsCalendarDrag.startY;
      if (!activeEventsCalendarDrag.axis && Math.max(Math.abs(distanceX), Math.abs(distanceY)) < 6) {
        return;
      }

      if (!activeEventsCalendarDrag.axis) {
        activeEventsCalendarDrag.axis = Math.abs(distanceX) > Math.abs(distanceY)
          ? "horizontal"
          : "vertical";
      }
      activeEventsCalendarDrag.moved = true;
      eventsCalendarScroll.classList.add('is-dragging');
      if (activeEventsCalendarDrag.axis === "horizontal") {
        eventsCalendarScroll.scrollLeft = activeEventsCalendarDrag.startScrollLeft - distanceX;
      } else {
        eventsCalendarScroll.scrollTop = activeEventsCalendarDrag.startScrollTop - distanceY;
      }
      event.preventDefault();
    }

    function finishEventsCalendarDrag() {
      if (!activeEventsCalendarDrag) {
        return;
      }

      suppressNextEventsCalendarClick = activeEventsCalendarDrag.moved;
      activeEventsCalendarDrag = null;
      eventsCalendarScroll.classList.remove('is-dragging');
      if (suppressNextEventsCalendarClick) {
        window.setTimeout(() => {
          suppressNextEventsCalendarClick = false;
        }, 0);
      }
    }

    eventsCalendarScroll.addEventListener('pointerdown', event => {
      if (event.button === 0) {
        startEventsCalendarDrag(event.clientX, event.clientY, event.target);
      }
    });
    window.addEventListener('pointermove', event => {
      moveEventsCalendarDrag(event.clientX, event.clientY, event);
    });
    window.addEventListener('pointerup', finishEventsCalendarDrag);
    window.addEventListener('pointercancel', () => {
      activeEventsCalendarDrag = null;
      eventsCalendarScroll.classList.remove('is-dragging');
    });

    document.getElementById('event-form').addEventListener('submit', event => {
      event.preventDefault();
      const titleInput = document.getElementById('event-title');
      const title = titleInput.value.trim();
      titleInput.setCustomValidity(title ? "" : "Informe um título para o evento.");
      if (!titleInput.reportValidity()) {
        return;
      }

      const eventId = document.getElementById('event-id').value;
      const eventIndex = calendarEvents.findIndex(item => item.id === eventId);
      const calendarEvent = {
        id: eventId || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        kind: document.getElementById('event-kind').value || "event",
        title,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        category: document.getElementById('event-category').value,
        notes: document.getElementById('event-notes').value.trim(),
        done: eventIndex >= 0 ? calendarEvents[eventIndex].done === true : false
      };
      if (eventIndex >= 0) {
        calendarEvents[eventIndex] = calendarEvent;
      } else {
        calendarEvents.push(calendarEvent);
      }
      saveCalendarEvents();
      document.getElementById('event-dialog').close();
    });

    document.getElementById('event-title').addEventListener('input', event => {
      event.target.setCustomValidity("");
    });

    document.getElementById('delete-calendar-event').addEventListener('click', () => {
      const eventId = document.getElementById('event-id').value;
      const calendarEvent = calendarEvents.find(item => item.id === eventId);
      if (!calendarEvent || !window.confirm(`Excluir o evento "${calendarEvent.title}"?`)) {
        return;
      }
      calendarEvents = calendarEvents.filter(item => item.id !== eventId);
      saveCalendarEvents();
      document.getElementById('event-dialog').close();
    });

    document.getElementById('close-event-dialog').addEventListener('click', () => {
      document.getElementById('event-dialog').close();
    });

    document.getElementById('cancel-event-dialog').addEventListener('click', () => {
      document.getElementById('event-dialog').close();
    });

    document.getElementById('previous-week').addEventListener('click', () => {
      loadWeekDataForStart(addDays(selectedWeekStart, -7));
    });

    document.getElementById('next-week').addEventListener('click', () => {
      loadWeekDataForStart(addDays(selectedWeekStart, 7));
    });

    document.getElementById('current-week').addEventListener('click', () => {
      loadWeekDataForStart(currentWeekStart);
    });

    document.getElementById('weekly-date-picker').addEventListener('change', event => {
      if (event.target.value) {
        loadWeekDataForStart(fromDateKey(event.target.value));
      }
    });

    function normalizeRangeStart() {
      const input = document.getElementById('weekly-range-start');
      if (input.value) {
        input.value = toDateKey(getWeekStart(fromDateKey(input.value)));
      }
    }

    function normalizeRangeEnd() {
      const input = document.getElementById('weekly-range-end');
      if (input.value) {
        input.value = toDateKey(addDays(getWeekStart(fromDateKey(input.value)), 6));
      }
    }

    function getWeeklyRangeBounds() {
      const startValue = document.getElementById('weekly-range-start').value;
      const endValue = document.getElementById('weekly-range-end').value;
      const feedback = document.getElementById('weekly-range-feedback');
      if (!startValue || !endValue) {
        feedback.textContent = "Selecione o domingo inicial e o sábado final do intervalo.";
        return null;
      }

      const startDate = fromDateKey(startValue);
      const endDate = fromDateKey(endValue);
      if (startDate.getDay() !== 0 || endDate.getDay() !== 6) {
        feedback.textContent = "O intervalo deve começar em um domingo e terminar em um sábado.";
        return null;
      }
      if (startValue > endValue) {
        feedback.textContent = "O sábado final deve ser igual ou posterior ao domingo inicial.";
        return null;
      }

      return { startDate, endDate };
    }

    document.getElementById('weekly-range-start').addEventListener('change', () => {
      normalizeRangeStart();
      document.getElementById('weekly-range-feedback').textContent = "";
    });

    document.getElementById('weekly-range-end').addEventListener('change', () => {
      normalizeRangeEnd();
      document.getElementById('weekly-range-feedback').textContent = "";
    });

    document.getElementById('clear-weekly-range').addEventListener('click', () => {
      const feedback = document.getElementById('weekly-range-feedback');
      const range = getWeeklyRangeBounds();
      if (!range) {
        return;
      }

      const formatDate = date => date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
      const rangeLabel = `${formatDate(range.startDate)} a ${formatDate(range.endDate)}`;
      const confirmed = window.confirm(
        `Limpar as atividades planejadas entre ${rangeLabel}?\\n\\nOs status diários V, R e X serão mantidos.`
      );
      if (!confirmed) {
        feedback.textContent = "Limpeza cancelada; nenhum cronograma foi alterado.";
        return;
      }

      let clearedWeeks = 0;
      for (
        let weekStart = new Date(range.startDate);
        toDateKey(weekStart) <= toDateKey(range.endDate);
        weekStart = addDays(weekStart, 7)
      ) {
        const weekKey = toDateKey(weekStart);
        weeklySchedules[weekKey] = createEmptyWeekData().map(day => ({
          day: day.day,
          subjects: []
        }));
        clearedWeeks += 1;
      }

      const selectedWeekInRange = selectedWeekStartKey >= toDateKey(range.startDate)
        && selectedWeekStartKey <= toDateKey(range.endDate);
      if (selectedWeekInRange) {
        weekData.forEach(day => {
          day.subjects = [];
        });
      }
      localStorage.setItem('weekly_planner_schedules', JSON.stringify(weeklySchedules));
      if (selectedWeekInRange) {
        localStorage.setItem('weekly_planner_data', JSON.stringify(weekData));
      }
      renderWeeklyGrid();
      renderMacro();
      feedback.textContent = `Atividades removidas de ${clearedWeeks} semana(s), entre ${rangeLabel}. Os status diários foram mantidos.`;
    });

    document.getElementById('apply-weekly-range').addEventListener('click', () => {
      const feedback = document.getElementById('weekly-range-feedback');
      const range = getWeeklyRangeBounds();
      if (!range) {
        return;
      }

      const formatDate = date => date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
      const weeksToUpdate = [];
      for (
        let weekStart = new Date(range.startDate);
        toDateKey(weekStart) <= toDateKey(range.endDate);
        weekStart = addDays(weekStart, 7)
      ) {
        const weekKey = toDateKey(weekStart);
        if (weekKey === selectedWeekStartKey) {
          continue;
        }
        const existingSchedule = weeklySchedules[weekKey];
        if (existingSchedule && existingSchedule.some(day => day.subjects.length > 0)) {
          weeksToUpdate.push({ weekKey, hasExistingPlan: true });
        } else {
          weeksToUpdate.push({ weekKey, hasExistingPlan: false });
        }
      }

      const existingWeeks = weeksToUpdate.filter(week => week.hasExistingPlan);
      const replaceExisting = existingWeeks.length > 0 && window.confirm(
        `${existingWeeks.length} semana(s) deste intervalo já têm cronograma. Deseja substituir esses cronogramas?\\n\\nOK: substituir os existentes.\\nCancelar: manter os existentes e aplicar apenas às semanas vazias.`
      );
      const sourceSchedule = weekData.map(day => ({
        day: day.day,
        subjects: day.subjects.map(subject => ({
          title: subject.title,
          subtasks: subject.subtasks.map(subtask => ({
            text: subtask.text,
            done: subtask.done
          }))
        }))
      }));
      let updatedWeeks = 0;
      let preservedWeeks = 0;

      weeksToUpdate.forEach(week => {
        if (week.hasExistingPlan && !replaceExisting) {
          preservedWeeks += 1;
          return;
        }
        weeklySchedules[week.weekKey] = sourceSchedule.map(day => ({
          day: day.day,
          subjects: day.subjects.map(subject => ({
            title: subject.title,
            subtasks: subject.subtasks.map(subtask => ({
              text: subtask.text,
              done: subtask.done
            }))
          }))
        }));
        updatedWeeks += 1;
      });

      localStorage.setItem('weekly_planner_schedules', JSON.stringify(weeklySchedules));
      feedback.textContent = `Cronograma da semana selecionada repetido em ${updatedWeeks} semana(s), no intervalo de ${formatDate(range.startDate)} a ${formatDate(range.endDate)}.${preservedWeeks ? ` ${preservedWeeks} semana(s) existente(s) foram mantidas.` : ""}`;
    });

    document.getElementById('apply-period').addEventListener('click', () => {
      const startValue = document.getElementById('period-start').value;
      const endValue = document.getElementById('period-end').value;
      const error = document.getElementById('period-error');
      if (!startValue || !endValue || startValue > endValue) {
        error.textContent = "Informe um intervalo válido: a data inicial deve ser anterior ou igual à final.";
        return;
      }
      periodStart = fromDateKey(startValue);
      periodEnd = fromDateKey(endValue);
      selectedDateKey = startValue;
      error.textContent = "";
      renderMacro();
    });

    document.getElementById('return-to-monthly').addEventListener('click', () => {
      document.querySelector('.nav-tab-item[data-view="macro"]').click();
    });

    function navigateToWeeklyDate(dateKey) {
      const selectedDate = fromDateKey(dateKey);
      const selectedDayIndex = selectedDate.getDay();
      selectedDateKey = dateKey;
      monthlyDateWasSelected = true;
      document.querySelector('.nav-tab-item[data-view="weekly"]').click();

      requestAnimationFrame(() => {
        const dayCard = document.getElementById(`weekly-day-${selectedDayIndex}`);
        if (!dayCard) {
          return;
        }
        dayCard.scrollIntoView({ behavior: "smooth", block: "center" });
        dayCard.focus({ preventScroll: true });
        dayCard.classList.add('is-focused');
        window.setTimeout(() => dayCard.classList.remove('is-focused'), 1600);
      });
    }

    document.getElementById('day-details').addEventListener('click', event => {
      if (event.target.closest('#edit-selected-day')) {
        navigateToWeeklyDate(selectedDateKey);
      }
    });

    document.querySelectorAll('.nav-tab-item[data-view]').forEach(button => {
      button.addEventListener('click', () => {
        const view = button.dataset.view;
        const isMacro = view === "macro";
        const wasMacro = !document.getElementById('macro-view').hidden;
        if (isMacro && !wasMacro) {
          monthlyDateWasSelected = false;
        }
        if (view === "weekly" && wasMacro) {
          const dateToHighlight = monthlyDateWasSelected ? fromDateKey(selectedDateKey) : today;
          loadWeekDataForStart(dateToHighlight, dateToHighlight);
        }
        document.getElementById('weekly-view').hidden = view !== "weekly";
        document.getElementById('macro-view').hidden = !isMacro;
        document.getElementById('events-view').hidden = view !== "events";
        document.getElementById('page-title').textContent = {
          weekly: "Planejamento Semanal",
          macro: "Acompanhamento Mensal",
          events: "Eventos e Prazos"
        }[view];

        document.querySelectorAll('.nav-tab-item[data-view]').forEach(viewButton => {
          const isActive = viewButton === button;
          viewButton.classList.toggle('active', isActive);
          viewButton.setAttribute('aria-pressed', String(isActive));
        });

        if (isMacro) {
          renderMacro();
        } else if (view === "events") {
          renderEventsCalendar();
          positionEventsCalendarAtCurrentMonth();
        }
      });
    });

    // Funções de Alteração de Dados
    function updateSubjectTitle(dayIdx, subjIdx, val) {
      weekData[dayIdx].subjects[subjIdx].title = val;
      saveWeekData();
    }

    function updateSubtaskText(dayIdx, subjIdx, subIdx, val) {
      weekData[dayIdx].subjects[subjIdx].subtasks[subIdx].text = val;
      saveWeekData();
    }

    function toggleSubtask(dayIdx, subjIdx, subIdx) {
      weekData[dayIdx].subjects[subjIdx].subtasks[subIdx].done = !weekData[dayIdx].subjects[subjIdx].subtasks[subIdx].done;
      saveWeekData();
      renderWeeklyGrid();
    }

    function addSubject(dayIdx) {
      if (weekData[dayIdx].subjects.length < 5) {
        weekData[dayIdx].subjects.push({
          title: "Novo Tópico Principal",
          subtasks: [{ text: "Novo subtópico", done: false }]
        });
        saveWeekData();
        renderWeeklyGrid();
      }
    }

    function removeSubject(dayIdx, subjIdx) {
      weekData[dayIdx].subjects.splice(subjIdx, 1);
      saveWeekData();
      renderWeeklyGrid();
    }

    function addSubtask(dayIdx, subjIdx) {
      if (weekData[dayIdx].subjects[subjIdx].subtasks.length < 10) {
        weekData[dayIdx].subjects[subjIdx].subtasks.push({ text: "Novo subtópico", done: false });
        saveWeekData();
        renderWeeklyGrid();
      }
    }

    function removeSubtask(dayIdx, subjIdx, subIdx) {
      weekData[dayIdx].subjects[subjIdx].subtasks.splice(subIdx, 1);
      saveWeekData();
      renderWeeklyGrid();
    }

    function setStatus(dayIdx, statusType) {
      const dayDateKey = toDateKey(addDays(selectedWeekStart, dayIdx));
      if (dayDateKey !== toDateKey(today) || !VALID_STATUSES.includes(statusType)) {
        return;
      }
      weekData[dayIdx].status = weekData[dayIdx].status === statusType ? '' : statusType;
      saveWeekData();
      renderWeeklyGrid();
      renderMacro();
    }

    renderWeeklyGrid();
    renderMacro();
