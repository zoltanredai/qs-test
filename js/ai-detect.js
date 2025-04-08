function startAiDetection() {
    let suspicion = {
        timeSpent: [],
        mouseMoved: [],
        keyEvents: [],
        honeypot: []
    };
    localStorage.setItem("suspicionAI", JSON.stringify(suspicion));
}

$(document).ready(function () {
    const suspicion = JSON.parse(localStorage.getItem("suspicionAI"));
    const questionStartTime = Date.now();
    let mouseMoved = [];
    let keyEvents = [];
    let lastMouseLog = 0;

    let $form = $("#survey-form");
    let $honeypot = $("<input>", {
        type: "text",
        name: "email2",
        style: "position:absolute;left:-9999px;",
        autocomplete: "off",
        tabindex: "-1",
        "aria-hidden": "true"
    });
    $form.append($honeypot);

    let $btn = $("#submitButton");
    if(Object.keys($btn).length > 0) {
        let oldHandlers = $._data($btn[0], "events")?.click?.map(h => h.handler) || [];
        $btn.off("click");
        $btn.on("click", function () {
            suspicion.timeSpent.push(Date.now() - questionStartTime);
            suspicion.mouseMoved.push(mouseMoved);
            suspicion.keyEvents.push(keyEvents);
            suspicion.keyEvents.push(keyEvents);
            suspicion.honeypot.push(!!$(document).find("input[name='email2']").val());
            localStorage.setItem("suspicionAI", JSON.stringify(suspicion));
        });
        oldHandlers.forEach(handler => {
            $btn.on("click", handler);
        });
    }

    $(document).on("mousemove", function (event) {
        const now = Date.now();
        if (now - lastMouseLog > 1000) {
            mouseMoved.push({x: event.pageX, y: event.pageY, time: Date.now()});
            lastMouseLog = now;
        }
    });

    $(document).on("keydown", function (e) {
        keyEvents.push({key: e.key, time: Date.now()});
    });


});

function analyzeBehavior() {
    const suspicion = JSON.parse(localStorage.getItem("suspicionAI"));

    return {
        webdriver: (navigator.webdriver === true),
        timeSpent: suspicion.timeSpent.filter(spent => spent < 1500).length,
        mouseMoved: suspicion.mouseMoved.map(moved => moved.length),
        keyEvents: suspicion.keyEvents.map(keys => keys.length),
        honeypot: suspicion.honeypot.filter(pot => pot === true).length
    }
}

