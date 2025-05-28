function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function generateId () {
    let storedValue = Math.floor(Math.random() * 1000000);
    localStorage.setItem("PanelistIDValue", storedValue);
    document.getElementById("PanelistID").value = storedValue;
}

function loadId () {
    document.getElementById("PanelistID").value = localStorage.getItem("PanelistIDValue");
}

function loadParams () {
    let client_id = getParameterByName("ClientID");
    if (client_id) {
        document.getElementById("ClientID").value = client_id;
    }
    let survey_id = getParameterByName("SurveyID");
    if (survey_id) {
        document.getElementById("SurveyID").value = survey_id;
    }
    let response_id = getParameterByName("PanelistID");
    if (response_id) {
        document.getElementById("PanelistID").value = response_id;
    }
}

$(document).ready(function () {
    loadParams();
    loadId();
});
