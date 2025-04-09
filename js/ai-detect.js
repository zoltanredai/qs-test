function startAiDetection() {
    let suspicion = {
        timeSpent: [],
        mouse: [],
        keyEvents: []
    };
    localStorage.setItem("suspicionAI", JSON.stringify(suspicion));
}

$(document).ready(function () {
    const suspicion = JSON.parse(localStorage.getItem("suspicionAI"));
    const questionStartTime = Date.now();
    let mouse = [];
    let mouseMoved = [];
    let keyEvents = [];
    let lastMouseLog = 0;


    let $btn = $("#submitButton");
    if (Object.keys($btn).length > 0) {
        let oldHandlers = $._data($btn[0], "events")?.click?.map(h => h.handler) || [];
        $btn.off("click");
        $btn.on("click", function () {
            evaluateMouseMoved();

            suspicion.timeSpent.push(Date.now() - questionStartTime);
            suspicion.keyEvents.push(keyEvents);
            suspicion.mouse.push(mouse);

            localStorage.setItem("suspicionAI", JSON.stringify(suspicion));
        });
        oldHandlers.forEach(handler => {
            $btn.on("click", handler);
        });
    }

    $(document).on("mousemove", function (event) {
        const now = Date.now();
        if (now - lastMouseLog > (mouseMoved.length < 100 ? 0 : 10 ** (1 + Math.floor(Math.log10(mouseMoved.length / 100))))) {
            mouseMoved.push({x: event.pageX, y: event.pageY, time: Date.now()});
            lastMouseLog = now;
        }
    });

    $(document).on('mousedown', function (event) {
        evaluateMouseMoved();
    });

    $(document).on("keydown", function (e) {
        keyEvents.push({key: e.key, time: Date.now()});
    });

    function evaluateMouseMoved() {
        if (mouseMoved.length > 1) {
            const mouseDistanceValue = mouseDistance();
            const mouseMovingTime = mouseMoved[mouseMoved.length - 1].time - mouseMoved[0].time;
            mouse.push({
                mousePointNumber: mouseMoved.length,
                leastSquaresDifValue: leastSquaresDif(),
                leastSquaresDifNormalValue: leastSquaresDif() / mouseMoved.length,
                mouseDistanceValue: mouseDistanceValue,
                mouseMovingTime: mouseMovingTime,
                mouseSpeed: mouseDistanceValue / mouseMovingTime,
                time: Date.now()
            });
        }
        mouseMoved = [];
    }

    function leastSquaresDif() {
        let sumxi = 0;
        let sumyi = 0;
        let sumxiyi = 0;
        let sumxi2 = 0;
        mouseMoved.forEach(p => {
            sumxi += p.x;
            sumyi += p.y;
            sumxiyi += (p.x * p.y);
            sumxi2 += (p.x * p.x);
        });
        let a = (mouseMoved.length * sumxiyi - sumxi * sumyi) / (mouseMoved.length * sumxi2 - sumxi * sumxi);
        let b = (sumyi - a * sumxi) / mouseMoved.length;
        return mouseMoved.map(p => (p.y - (a * p.x + b)) ** 2).reduce((sum, dif) => sum + dif, 0);
    }

    function mouseDistance() {
        return mouseMoved
            .map((point, i) =>
                (i === mouseMoved.length - 1) ? 0 :
                    Math.sqrt(((mouseMoved[i + 1].x - point.x) ** 2) + ((mouseMoved[i + 1].y - point.y) ** 2))
            )
            .reduce((sum, distance) => sum + distance, 0);
    }
});

function analyzeBehavior() {
    const suspicion = JSON.parse(localStorage.getItem("suspicionAI"));

    return {
        webdriver: (navigator.webdriver === true),
        timeSpent: suspicion.timeSpent.filter(spent => spent < 1500).length,
        mouseMoved: suspicion.mouse.map(moved => moved),
        keyEvents: suspicion.keyEvents.map(keys => keys.length),
    }
}
