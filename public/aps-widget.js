(function () {
  function loadWidget() {
    // Create container
    const container = document.createElement("div");
    container.id = "aps-widget-root";
    document.body.appendChild(container);

    // Inject styles
    const style = document.createElement("style");
    style.innerHTML = `
      #aps-widget-root {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        max-height: 80vh;
        overflow-y: auto;
        background: white;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        font-family: Arial;
      }

      .aps-btn {
        margin: 5px;
        padding: 6px 10px;
        border: none;
        cursor: pointer;
        background: #eee;
      }

      .aps-btn.active {
        background: #007bff;
        color: white;
      }

      .aps-submit {
        margin-top: 10px;
        padding: 10px;
        width: 100%;
        background: black;
        color: white;
        border: none;
        cursor: pointer;
      }

      .aps-card {
        padding: 10px;
        margin-top: 10px;
        border-radius: 6px;
      }

      .high { background: #d4edda; }
      .moderate { background: #fff3cd; }
      .low { background: #f8d7da; }
    `;
    document.head.appendChild(style);

    // QUESTIONS (minimal for now)
    const QUESTIONS = [
      { id: 1, text: "I start conversations easily." },
      { id: 2, text: "I like structured environments." },
      { id: 3, text: "I value emotional connections." }
    ];

    const OPTIONS = [
      { label: "Very Often", value: 3 },
      { label: "Often", value: 2 },
      { label: "Sometimes", value: 1 },
      { label: "Rarely/Never", value: 0 }
    ];

    const PROGRAMS = [
      { name: "BSc Accounting", weight: 3 },
      { name: "BSc IT Management", weight: 3 },
      { name: "BSc Business Admin", weight: 2 },
      { name: "BA Communication", weight: 1 }
    ];

    let answers = {};

    function render() {
      container.innerHTML = `<h3>APS Analyzer</h3>`;

      QUESTIONS.forEach(q => {
        const qDiv = document.createElement("div");
        qDiv.innerHTML = `<p>${q.text}</p>`;

        OPTIONS.forEach(opt => {
          const btn = document.createElement("button");
          btn.className = "aps-btn";
          btn.innerText = opt.label;

          if (answers[q.id] === opt.value) {
            btn.classList.add("active");
          }

          btn.onclick = () => {
            answers[q.id] = opt.value;
            render();
          };

          qDiv.appendChild(btn);
        });

        container.appendChild(qDiv);
      });

      const submit = document.createElement("button");
      submit.className = "aps-submit";
      submit.innerText = "Submit";

      submit.onclick = handleSubmit;

      container.appendChild(submit);
    }

    function handleSubmit() {
      if (Object.keys(answers).length < QUESTIONS.length) {
        alert("Answer all questions");
        return;
      }

      const total = Object.values(answers).reduce((a, b) => a + b, 0);

      const results = PROGRAMS.map(p => {
        const score = Math.round((total / (QUESTIONS.length * 3)) * 100);

        let level = "Low Fit";
        if (score > 70) level = "High Fit";
        else if (score > 40) level = "Moderate Fit";

        return {
          name: p.name,
          score,
          level
        };
      });

      renderResults(results);
    }

    function renderResults(results) {
      container.innerHTML = `<h3>Results</h3>`;

      results.forEach(r => {
        const card = document.createElement("div");
        card.className = `aps-card ${
          r.level === "High Fit"
            ? "high"
            : r.level === "Moderate Fit"
            ? "moderate"
            : "low"
        }`;

        card.innerHTML = `
          <strong>${r.name}</strong>
          <div>${r.score}% — ${r.level}</div>
        `;

        container.appendChild(card);
      });

      const btn = document.createElement("button");
      btn.className = "aps-submit";
      btn.innerText = "Send to Admissions";

      btn.onclick = () => {
        console.log("SEND DATA:", results);

        // 🔥 This is where API integration goes later
        alert("Profile sent to admissions system");
      };

      container.appendChild(btn);
    }

    render();
  }

  // Wait for page load
  if (document.readyState === "complete") {
    loadWidget();
  } else {
    window.addEventListener("load", loadWidget);
  }
})();