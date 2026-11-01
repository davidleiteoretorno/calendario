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
    let macroViewMode = "month";
    let selectedDateKey = toDateKey(today);
    let periodStart = new Date(today.getFullYear(), today.getMonth(), 1, 12);
    let periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 12);
    let legacyWeekData = JSON.parse(localStorage.getItem('weekly_planner_data')) || initialWeekData;
    let productivityHistory = JSON.parse(localStorage.getItem('weekly_planner_history')) || {};
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
          const isConsecutive = previousDate
            && addDays(fromDateKey(previousDate), 1).getTime() === fromDateKey(dateKey).getTime();
          streak = isConsecutive ? streak + 1 : 1;
          bestStreak = Math.max(bestStreak, streak);
        } else {
          streak = 0;
        }
        previousDate = dateKey;
      });

      const todayStatus = productivityHistory[todayKey];
      let streakDate = fromDateKey(todayKey);
      if (VALID_STATUSES.includes(todayStatus) && todayStatus !== "v") {
        streakDate = null;
      } else if (!VALID_STATUSES.includes(todayStatus)) {
        streakDate = addDays(streakDate, -1);
      }

      let currentStreak = 0;
      while (streakDate) {
        const status = productivityHistory[toDateKey(streakDate)];
        if (status !== "v") {
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
        const hasActivities = Boolean(dayPlan && dayPlan.subjects.length > 0);
        const activitiesClass = hasActivities ? " has-activities" : "";
        const dateLabel = date.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        });

        return `
          <button class="calendar-day${todayClass}${selectedClass}${futureClass}${activitiesClass}" type="button" data-calendar-date="${dateKey}" title="${dateLabel}${hasActivities ? ": Com atividades planejadas" : ""}. Status: ${statusLabel}" aria-label="Ver atividades de ${dateLabel}.${hasActivities ? " Há atividades planejadas." : " Sem atividades planejadas."} Status: ${statusLabel}" aria-pressed="${dateKey === selectedDateKey}">
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
      let subjectsHtml = `<p class="day-details-empty">Não há atividades planejadas para este dia da semana.</p>`;

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

      document.getElementById('day-details').innerHTML = `
        <div class="day-details-header">
          <h3 id="day-details-title">Atividades de ${escapeHtml(dateLabel)}</h3>
          <span class="day-details-status${statusClass}">${statusLabel}</span>
        </div>
        ${subjectsHtml}
        <div class="day-details-actions">
          <button class="view-action-button" type="button" id="edit-selected-day">Editar planejamento desta semana →</button>
        </div>
      `;
    }

    function renderMacro() {
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
          <span class="macro-stat-detail">Dias produtivos consecutivos</span>
        </article>
        <article class="macro-stat-card">
          <span class="macro-stat-label">Recorde histórico</span>
          <strong class="macro-stat-value">${formatDayCount(stats.bestStreak)}</strong>
          <span class="macro-stat-detail">Maior sequência sem dias ruins ou inativos</span>
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
    document.getElementById('calendar-view-target').addEventListener('click', event => {
      const dayButton = event.target.closest('[data-calendar-date]');
      if (!dayButton) {
        return;
      }
      const dateKey = dayButton.dataset.calendarDate;
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
        const isMacro = button.dataset.view === "macro";
        const wasMacro = !document.getElementById('macro-view').hidden;
        if (isMacro && !wasMacro) {
          monthlyDateWasSelected = false;
        }
        if (!isMacro && wasMacro) {
          const dateToHighlight = monthlyDateWasSelected ? fromDateKey(selectedDateKey) : today;
          loadWeekDataForStart(dateToHighlight, dateToHighlight);
        }
        document.getElementById('weekly-view').hidden = isMacro;
        document.getElementById('macro-view').hidden = !isMacro;
        document.getElementById('page-title').textContent = isMacro
          ? "Acompanhamento Mensal"
          : "Planejamento Semanal";

        document.querySelectorAll('.nav-tab-item[data-view]').forEach(viewButton => {
          const isActive = viewButton === button;
          viewButton.classList.toggle('active', isActive);
          viewButton.setAttribute('aria-pressed', String(isActive));
        });

        if (isMacro) {
          renderMacro();
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
