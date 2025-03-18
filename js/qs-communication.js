function CollectQSDataResponse(jsonData) {
    document.getElementById('CollectCompleted').value = "1";
    document.forms[0].submit();
}

function QSDataNoResponse() {
    if (document.getElementById('CollectCompleted').value == "0") {
        document.forms[0].submit();
    }
}

function getMatrixData(mq) {
    if (mq == "") {
        return "";
    } else {
        var a = mq.split("|");
        var mstr = "";

        for (var i = 0; i < a.length; i++) {
            if (mstr != "") {
                mstr += '|';
            }
            var qid = a[i];
            var rows = document.getElementById(a[i]).getElementsByTagName('tr');
            var thisdata = "";

            for (var j = 0; j < rows.length; j++) {
                var thisrow = "";
                var mdatai = rows[j].getElementsByTagName('input');

                for (var k = 0; k < mdatai.length; k++) {
                    if (mdatai[k].checked) {
                        if (thisdata == "") {
                            thisdata += qid + ':';
                        }
                        var row = mdatai[k].name;
                        if (thisrow == "") {
                            thisrow += row + '-';
                        }
                        var cell = mdatai[k].value;
                        thisrow += cell + ',';
                    }
                }

                if (thisrow != "") {
                    thisrow = thisrow.substring(0, thisrow.length - 1) + ';'; // delimit rows by ;
                }
                thisdata += thisrow;
            }
            mstr += thisdata.substring(0, thisdata.length - 1);
        }
        return mstr;
    }
}

function submitPage(page) {
    setTimeout("QSDataNoResponse();", 5000);
    imperium_qualityscore.CollectData(page, '', CollectQSDataResponse);
}

function submitMatrixPage(page, matrix) {
    setTimeout("QSDataNoResponse();", 5000);
    imperium_qualityscore.CollectData(page, getMatrixData(matrix), CollectQSDataResponse);
}

function AnalyzeData () {
    imperium_qualityscore.AnalyzeData(
        AnalyzeDataResponse,
        {
            QualityQuestionsTotal: 12,
            QualityQuestionsFailed: 0
        }
    );
}

function AnalyzeDataResponse(jsonData) {
    if (jsonData.StatusCode == 200) {
        document.getElementById('Score').value = jsonData.Score
        document.getElementById('StraightlineRanking').value = jsonData.StraightlineRanking
        document.getElementById('SpeedingRanking').value = jsonData.SpeedingRanking
        document.getElementById('RASRanking').value = jsonData.RASRanking
        document.getElementById('OutlierGroups').value = JSON.stringify(jsonData.OutlierGroups)
    } else {
        console.log(jsonData);
    }
}

$(document).ready(function () {
    let raAttr = {};
    raAttr.NlptScore = "1";
    raAttr.AnalyzeQuestionText = true;
    raAttr.QuestionText = "Test Question Test";
    raAttr.AcceptNotSupportedLanguages = "1";
    raAttr.IsBrandQuestion = "1";
    raAttr.LanguageCode = "lt";

    $(".imperium-ra-question").each(function () {
        $(this).prop('imperium-ra-attrs', raAttr);
    });
});


