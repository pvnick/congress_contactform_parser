/*

**Notes**

In some cases, forms will still get submitted when you click the submit button.
The alert that pops up will pause the page load and let you see whether or not
a request was started. If so, hit escape immediately after dismissing the alert
box--it's important that the data you gathered be committed to local storage
before reloading the page. Most forms where this happens will not re-submit
when you click 'next' as instructed, so you can just pop open the console you
pasted this code into again, and find the form using jQuery: `jQuery('form')`
will print all of the forms in the DOM, and then, if yours is the 2nd one, for
example, you can run this: `jQuery('form').eq(1).submit()`. Note that the
element arrays returned by jQuery are zero-indexed, so 1 is actually the
second in the list.

These senators use captcha:
http://www.coburn.senate.gov/public/index.cfm/contactsenatorcoburn?p=ContactForm
http://www.crapo.senate.gov/contact/email.cfm
http://moran.senate.gov/public/index.cfm/e-mail-jerry
http://www.paul.senate.gov/?p=contact
http://www.risch.senate.gov/public/index.cfm?p=Email
http://www.roberts.senate.gov/public/index.cfm?p=EmailPat
http://www.shelby.senate.gov/public/index.cfm/emailsenatorshelby
http://www.toomey.senate.gov/?p=contact

List is short enough to fill in manually
*/

(function () {
    var $workingSpace,
        $workingButton,
        workingSpaceContainer,
        currentStep = -1,
        stepDefinition = 0,
        myButtonClass = "congressContactFormHandlerButton",
        steps = {
            GENDER: stepDefinition++,
            FIRST_NAME: stepDefinition++,
            LAST_NAME: stepDefinition++,
            ADDRESS: stepDefinition++, 
            ADDRESS2: stepDefinition++, 
            CITY: stepDefinition++,
            STATE: stepDefinition++,
            COUNTY: stepDefinition++,
            ZIPCODE: stepDefinition++,
            PHONE: stepDefinition++,
            WORK_PHONE: stepDefinition++,
            EMAIL: stepDefinition++,
            VERIFYEMAIL: stepDefinition++,
            MESSAGETOPIC: stepDefinition++,
            MESSAGESUBJECT: stepDefinition++,
            MESSAGE: stepDefinition++,
            CAPTCHATEXT: stepDefinition++, 
            CAPTCHAIMAGE: stepDefinition++, 
            WANT_RESPONSE: stepDefinition++,
            SUBMIT: stepDefinition++,
            DOUBLECHECK: stepDefinition++
        },
        $elements = {},
        storageData = {},
        desiredElementDescription = "",
        hostBioGuideIDs = {
            "alexander.senate.gov":"A000360",
            "ayotte.senate.gov":"A000368",
            "baldwin.senate.gov":"B001230",
            "barrasso.senate.gov":"B001261",
            "baucus.senate.gov":"B000243",
            "begich.senate.gov":"B001265",
            "bennet.senate.gov":"B001267",
            "blumenthal.senate.gov":"B001277",
            "blunt.senate.gov":"B000575",
            "boozman.senate.gov":"B001236",
            "boxer.senate.gov":"B000711",
            "brown.senate.gov":"B000944",
            "burr.senate.gov":"B001135",
            "cantwell.senate.gov":"C000127",
            "cardin.senate.gov":"C000141",
            "carper.senate.gov":"C000174",
            "casey.senate.gov":"C001070",
            "chambliss.senate.gov":"C000286",
            "coats.senate.gov":"C000542",
            "coburn.senate.gov":"C000560",
            "cochran.senate.gov":"C000567",
            "collins.senate.gov":"C001035",
            "coons.senate.gov":"C001088",
            "corker.senate.gov":"C001071",
            "cornyn.senate.gov":"C001056",
            "cowan.senate.gov":"C001099",
            "crapo.senate.gov":"C000880",
            "cruz.senate.gov":"C001098",
            "donnelly.senate.gov":"D000607",
            "durbin.senate.gov":"D000563",
            "enzi.senate.gov":"E000285",
            "feinstein.senate.gov":"F000062",
            "fischer.senate.gov":"F000463",
            "flake.senate.gov":"F000444",
            "franken.senate.gov":"F000457",
            "gillibrand.senate.gov":"G000555",
            "lgraham.senate.gov":"G000359",
            "grassley.senate.gov":"G000386",
            "hagan.senate.gov":"H001049",
            "harkin.senate.gov":"H000206",
            "hatch.senate.gov":"H000338",
            "heinrich.senate.gov":"H001046",
            "heitkamp.senate.gov":"H001069",
            "heller.senate.gov":"H001041",
            "hirono.senate.gov":"H001042",
            "hoeven.senate.gov":"H001061",
            "inhofe.senate.gov":"I000024",
            "isakson.senate.gov":"I000055",
            "johanns.senate.gov":"J000291",
            "ronjohnson.senate.gov":"J000293",
            "johnson.senate.gov":"J000177",
            "kaine.senate.gov":"K000384",
            "king.senate.gov":"K000383",
            "kirk.senate.gov":"K000360",
            "klobuchar.senate.gov":"K000367",
            "landrieu.senate.gov":"L000550",
            "leahy.senate.gov":"L000174",
            "lee.senate.gov":"L000577",
            "levin.senate.gov":"L000261",
            "manchin.senate.gov":"M001183",
            "mccain.senate.gov":"M000303",
            "mccaskill.senate.gov":"M001170",
            "mcconnell.senate.gov":"M000355",
            "menendez.senate.gov":"M000639",
            "merkley.senate.gov":"M001176",
            "mikulski.senate.gov":"M000702",
            "moran.senate.gov":"M000934",
            "murkowski.senate.gov":"M001153",
            "murphy.senate.gov":"M001169",
            "murray.senate.gov":"M001111",
            "billnelson.senate.gov":"N000032",
            "paul.senate.gov":"P000603",
            "portman.senate.gov":"P000449",
            "pryor.senate.gov":"P000590",
            "reed.senate.gov":"R000122",
            "reid.senate.gov":"R000146",
            "risch.senate.gov":"R000584",
            "roberts.senate.gov":"R000307",
            "rockefeller.senate.gov":"R000361",
            "rubio.senate.gov":"R000595",
            "sanders.senate.gov":"S000033",
            "schatz.senate.gov":"S001194",
            "schumer.senate.gov":"S000148",
            "scott.senate.gov":"S001184",
            "sessions.senate.gov":"S001141",
            "shaheen.senate.gov":"S001181",
            "shelby.senate.gov":"S000320",
            "stabenow.senate.gov":"S000770",
            "tester.senate.gov":"T000464",
            "thune.senate.gov":"T000250",
            "toomey.senate.gov":"T000461",
            "markudall.senate.gov":"U000038",
            "tomudall.senate.gov":"U000039",
            "vitter.senate.gov":"V000127",
            "warner.senate.gov":"W000805",
            "warren.senate.gov":"W000817",
            "whitehouse.senate.gov":"W000802",
            "wicker.senate.gov":"W000437",
            "wyden.senate.gov":"W000779"
        },
        selectionBuilder;
    
    function importScript(src) {
        var s = document.createElement("script");
        s.setAttribute('src', src);
        document.getElementsByTagName("body")[0].appendChild(s);
    }

    function importJS(src, look_for, onload) {
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', src);
        if (onload) {
            waitForScriptLoad(look_for, onload);
        }
        var head = document.getElementsByTagName('head')[0];
        if (head) {
            head.appendChild(s);
        } else {
            document.body.appendChild(s);
        }
    }

    function waitForScriptLoad(look_for, callback) {
        var interval = setInterval(function() {
            if (eval("typeof " + look_for) != 'undefined') {
                clearInterval(interval);
                callback();
            }
        }, 50);
    }

    function makeElementDescriptor($element, elementSelectionStep) {
        if ($element && $element[0]) {
            var descriptor = {
                name: $element.attr("name"),
                values: [],
                type: $element[0].tagName.toLowerCase(),
                elementTypeProperty: "",
                required: !! $element.data("required"),
                selector: getSelector($element),
                variable: getInputVariableName(elementSelectionStep)
            };
            
            if (descriptor.type == "input") {
                descriptor.elementTypeProperty = ($element.attr("type") || "text").toLowerCase();
            }

            if (descriptor.type == "select") {
                var $children = $element.children("option");
                if (
                    ($children.eq(1).text() == $children.eq(1).val()) &&
                    ($children.eq(2).text() == $children.eq(2).val())
                ){
                    $children.each(function(index, opt){
                        descriptor.values.push(jQuery(opt).val());
                    });
                }else{
                    descriptor.values = {};
                    $children.each(function(index, opt){
                        var el = jQuery(opt);
                        descriptor.values[el.text()] = el.val();
                    });
                }
            } else {
                descriptor.values.push($element.val());
            }
            return descriptor;
        } else {
            return null;
        }
    }

    function storeElementsInLocalStorage() {
        var $parentForm = null,
            usedInputNames = {};

        storageData = {
            "hardcoded_values": {},
            "adhoc_values": [],
            "contact_form_location": location.href,
            "form_method": "POST",
            "form_action": ""
        }
        //built-in input elements
        for (var stepName in steps) {
            var stepValue = steps[stepName],
                $stepElement = $elements[stepValue];
            if ($stepElement) {
                var stepElementName = $stepElement.attr("name");
                storageData["hardcoded_values"]["step_" + stepValue + "_descriptor"] = makeElementDescriptor($stepElement, stepValue);
                usedInputNames[stepElementName] = true;
                if ( ! $parentForm) {
                    $parentForm = $stepElement.closest("form");
                }
            }
        }
        //adhoc input elements
        $parentForm.find("input").each(function(index, element) {
            var $element = jQuery(element),
                elementName = $element.attr("name"),
                elementVal = $element.val();
            if ( (!(elementName in usedInputNames)) && 
                    ($element.attr('type') != 'checkbox' || $element.is(':checked'))
                ) {
                storageData["adhoc_values"].push(
                    makeElementDescriptor($element, -1)
                );
            }
        });
        if ($parentForm.attr("method")) {
            storageData["form_method"] = $parentForm.attr("method").toUpperCase();
        }
        if ($parentForm.attr("action")) {
            storageData["form_action"] = $parentForm.attr("action");
            if (storageData["form_action"][0] == "/"){
                storageData["form_action"] = location.protocol + "//" + location.host + storageData["form_action"];
            }
        } else {
            storageData["form_action"] = location.href;
        }
        //other stuff we'll need for the yaml
        window.localStorage["CONTACT_STORAGE_DATA"] = JSON.stringify(storageData);
    }
    
    function workingButtonClicked() {
        if (currentStep == steps.DOUBLECHECK) {
            storeElementsInLocalStorage();
            $elements[steps.SUBMIT].click();
        } else {
            //skip button
            nextStep();
        }
    }
    
    function fillInFillerData($targetElement) {
        switch ($targetElement[0].tagName.toLowerCase()) {
            case "select":
                var elementChildren = $targetElement.children("option"),
                    lastChild = elementChildren[elementChildren.length - 1];
                $targetElement.val(lastChild.value);
                break;
            case "input":
            case "textarea":
                var val = "";
                switch (currentStep) {
                    case steps.GENDER:
                        val = "Mr.";
                        break;
                    case steps.FIRST_NAME:
                        val = "John";
                        break;
                    case steps.LAST_NAME:
                        val = "Smith";
                        break;
                    case steps.ADDRESS: 
                        val = "111 NW 11 Pl";
                        break;
                    case steps.ADDRESS2: 
                        val = "";
                        break;
                    case steps.CITY: 
                        val = "Winchestertonfieldville";
                        break;
                    case steps.STATE: 
                        val = "Fl.";
                        break;
                    case steps.COUNTY:
                        val = "Arlington"
                        break;
                    case steps.ZIPCODE: 
                        val = "11111";
                        break;
                    case steps.PHONE: 
                        val = "(555) 555-5555";
                        break;
                    case steps.WORK_PHONE: 
                        val = "(555) 555-5555";
                        break;
                    case steps.EMAIL: 
                        val = "test@example.com";
                        break;
                    case steps.VERIFYEMAIL: 
                        val = "test@example.com";
                        break;
                    case steps.MESSAGETOPIC: 
                        val = "this is a test";
                        break;
                    case steps.MESSAGESUBJECT: 
                        val = "this is a test";
                        break;
                    case steps.MESSAGE: 
                        val = "this is a test";
                        break;
                    case steps.WANT_RESPONSE:
                        val = true
                        break
                }
                if (val != "") {
                    $targetElement.val(val);
                }
            break;
        }
    }

    function backButtonClicked() {
        if (currentStep > 0) {
            currentStep -= 2;
            jQuery("#identifying_element_" + (currentStep + 1)).remove();
            nextStep();
        }
    }

    function initializeContactFormSelectionProcess() {
        $workingSpaceContainer = jQuery("<center />");
        $workingButton = jQuery("<button />")
            .text("Skip")
            .addClass(myButtonClass)
            .click(workingButtonClicked);
        $backButton = jQuery("<button />")
            .text("Back")
            .addClass(myButtonClass)
            .click(backButtonClicked);
        $workingSpace = jQuery("<span />").css({"margin": "10px", "color": "black"});
        $workingSpaceContainer
            .css({
                "position":"fixed",
                "left": "0px",
                "top": "0px",
                "width": "100%",
                "background": "white",
                "padding": "5px",
                "border": "solid black 1px",
                "z-index": 10000
            })
            .append($workingSpace)
            .append($workingButton)
            .prepend($backButton);
        jQuery("body").append($workingSpaceContainer);
        //some form elements are dependent on others being answered. to the server it should all look the same, so show everything to help the user find all the elements
        jQuery("form").children().show()
        nextStep();
    }

    function reset() {
        window.localStorage["CONTACT_STORAGE_DATA"] = "";
        window.location.reload();
    }

    function getInputVariableName(step) {
        var val = "";
        switch (step) {
            case steps.GENDER:
                val = "$NAME_PREFIX";
                break;
            case steps.FIRST_NAME:
                val = "$NAME_FIRST";
                break;
            case steps.LAST_NAME:
                val = "$NAME_LAST";
                break;
            case steps.ADDRESS: 
                val = "$ADDRESS_STREET";
                break;
            case steps.ADDRESS2: 
                val = "$ADDRESS_STREET_2";
                break;
            case steps.CITY: 
                val = "$ADDRESS_CITY";
                break;
            case steps.STATE: 
                val = "$ADDRESS_STATE_POSTAL_ABBREV";
                break;
            case steps.COUNTY:
                val = "$COUNTY";
                break;
            case steps.ZIPCODE: 
                val = "$ADDRESS_ZIP5";
                break;
            case steps.PHONE: 
            case steps.WORK_PHONE: 
                val = "$PHONE";
                break;
            case steps.EMAIL: 
            case steps.VERIFYEMAIL: 
                val = "$EMAIL";
                break;
            case steps.MESSAGETOPIC: 
                val = "$TOPIC";
                break;
            case steps.MESSAGESUBJECT: 
                val = "$SUBJECT";
                break;
            case steps.MESSAGE: 
                val = "$MESSAGE";
                break;
            case steps.WANT_RESPONSE:
                val = true
        }
        return val;
    }

    function getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }

    function getCurrentBioGuideID() {
        var currentHost = location.host;
        for (host in hostBioGuideIDs) {
            if (currentHost.has(host)) {
                return hostBioGuideIDs[host];
            }
        }
        return null;
    }

    function getElementYAMLContribution(descriptor) {
        var contribution = "",
            elementType = descriptor["type"],
            elementName = descriptor["name"],
            elementValues = descriptor["values"],
            elementSelector = descriptor["selector"],
            elementVariable = descriptor["variable"],
            required = descriptor["required"];

        if (!!elementName && (elementValues.length || typeof elementValues === "object")) {
            contribution += "      - name: " + elementName + "\n";
            contribution += "        selector: \"" + elementSelector + "\"\n";
            if (elementVariable === true) {
                contribution += "        value: Yes\n"
            } else if (elementVariable === false) {
                contribution += "        value: No\n"
            } else if (!!elementVariable) {
                contribution += "        value: " + JSON.stringify(elementVariable) + "\n";
            } else {
                contribution += "        value: " + JSON.stringify(elementValues[0]) + "\n";
            }
            if (required) {
                contribution += "        required: Yes\n";
            }
            if (elementType == "select") {
                if (elementVariable == "$ADDRESS_STATE_POSTAL_ABBREV") {
                    contribution += "        options: US_STATES_AND_TERRITORIES\n";
                } else {
                    contribution += "        options:\n";
                    for (var index in elementValues) {
                        var value = elementValues[index];
                        if (typeof value == "string" && value.trim() != "") {
                            if (typeof elementValues === "object" && typeof elementValues.length === "undefined") {
                                contribution += "          " + JSON.stringify(index) + ": " + JSON.stringify(value) + "\n";
                            } else {
                                contribution += "          - " + JSON.stringify(value) + "\n";
                            }
                        }
                    }

                }
            }
        }

        return contribution;
    }

    function buildYAML(contactFormData) {
        var bioguideId = getCurrentBioGuideID(),
            formMethod = contactFormData["form_method"],
            formAction = contactFormData["form_action"],
            YAML = "";
        YAML += "bioguide: " + bioguideId + "\n";
        YAML += "contact_form:\n";
        YAML += "  method: " + formMethod + "\n";
        YAML += "  action: " + formAction + "\n";
        YAML += "  steps:\n";
        YAML += "    - visit: " + contactFormData["contact_form_location"] + "\n";

        YAML += "    - fill_in:\n";
        for (var stepName in steps) {
            var stepValue = steps[stepName],
                descriptor = storageData["hardcoded_values"]["step_" + stepValue + "_descriptor"];
            if (descriptor && 
                    (
                        (descriptor["type"] == "input" && ["text", "number", "tel", "email"].indexOf(descriptor["elementTypeProperty"]) > -1) || (descriptor["type"] == "textarea")
                    )
                ) {
                YAML += getElementYAMLContribution(descriptor);
            }
        }
        for (var adhocElementIndex in storageData["adhoc_values"]) {
            var stepValue = steps[stepName],
                descriptor = storageData["adhoc_values"][adhocElementIndex];
            if (descriptor && 
                    (
                        (descriptor["type"] == "input" && ["text", "number", "tel", "email"].indexOf(descriptor["elementTypeProperty"]) > -1) || (descriptor["type"] == "textarea")
                    )
                ) {
                YAML += getElementYAMLContribution(descriptor);
            }
        }

        YAML += "    - select:\n";
        for (var stepName in steps) {
            var stepValue = steps[stepName],
                descriptor = storageData["hardcoded_values"]["step_" + stepValue + "_descriptor"];
            if (descriptor && descriptor["type"] == "select") {
                YAML += getElementYAMLContribution(descriptor);
            }
        }
        for (var adhocElementIndex in storageData["adhoc_values"]) {
            var stepValue = steps[stepName],
                descriptor = storageData["adhoc_values"][adhocElementIndex];
            if (descriptor && descriptor["type"] == "select") {
                YAML += getElementYAMLContribution(descriptor);
            }
        }

        var checkbox_count = 0;
        for (var stepName in steps) {
            var stepValue = steps[stepName],
                descriptor = storageData["hardcoded_values"]["step_" + stepValue + "_descriptor"];
            if (descriptor && descriptor["type"] == "input" && descriptor["elementTypeProperty"] == "checkbox") {
                if (checkbox_count == 0){
                    YAML += "    - check:\n";
                }
                YAML += getElementYAMLContribution(descriptor);
                checkbox_count++;
            }
        }
        for (var adhocElementIndex in storageData["adhoc_values"]) {
            var stepValue = steps[stepName],
                descriptor = storageData["adhoc_values"][adhocElementIndex];
            if (descriptor && descriptor["type"] == "input" && descriptor["elementTypeProperty"] == "checkbox") {
                if (checkbox_count == 0){
                    YAML += "    - check:\n";
                }
                YAML += getElementYAMLContribution(descriptor);
                checkbox_count++;
            }
        }

        var submitDescriptor = storageData["hardcoded_values"]["step_" + steps.SUBMIT + "_descriptor"];
        YAML += "    - click_on:\n";
        YAML += "      - value: Submit\n";
        YAML += "        selector: \"" + submitDescriptor["selector"] + "\"\n";

        YAML += "  success:\n";
        YAML += "    headers:\n";
        YAML += "      status: 200\n";
        YAML += "    body:\n";
        YAML += "      contains: " + JSON.stringify(storageData["success_text"]);

        var $YAMLTextbox = jQuery("<textarea editable=\"false\" />")
            .css({
                height: "200px",
                width: "600px"
            })
            .text(YAML);
        $workingSpaceContainer
            .css("height", "70%")
            .append(jQuery("<br />"))
            .append($YAMLTextbox);
        $YAMLTextbox.after('<p>Finally, send us your work by pasting the contents below into a <a href="https://github.com/unitedstates/contact-congress/new/master/members?filename=' + bioguideId + '.yaml" target="_blank">new file on github</a>, and then clicking "Propose New File" below it.</p>');
    }

    function buildYAMLButtonClicked() {
        var selectedText = getSelectionText();
        if (confirm("Is this the correct success text?\n\n" + selectedText)) {
            storageData = JSON.parse(localStorage["CONTACT_STORAGE_DATA"]);
            storageData["success_text"] = selectedText;
            buildYAML(storageData);
        }
    }

    function initializeSuccessMessageSelectionProcess() {
        $workingSpaceContainer = jQuery("<center />");
        var $resetButton = jQuery("<button />")
                .text("Reset and start over")
                .addClass(myButtonClass)
                .click(reset),
            $buildYAMLButton = jQuery("<button />")
                .text("Build YAML")
                .addClass(myButtonClass)
                .click(buildYAMLButtonClicked);
        $workingSpace = jQuery("<span />").css("margin", "10px");
        $workingSpaceContainer
            .css({
                "position":"fixed",
                "left": "0px",
                "top": "0px",
                "width": "100%",
                "background": "white",
                "padding": "5px",
                "border": "solid black 1px",
                "z-index": 10000
            })
            .append($workingSpace)
            .append($buildYAMLButton)
            .prepend($resetButton);
        jQuery("body").append($workingSpaceContainer);
        $workingSpace.text("Please select the success message and click 'Build YAML'");
    }

    function getSelector($element) {
        /* This makes sure that a bare tagname doesn't get used when more than one is in the dom */
        var t = $element[0].tagName,
            s = jQuery(t).not($element),
            reject = jQuery.map(['html', 'body', 'head', 'base'], function(selector) { return jQuery(selector).get(0) });
        if (s.length) reject = jQuery.merge(reject, s);
        return selectionBuilder.predictCss($element, reject);
    }
    
    function go() {
        importJS('https://code.jquery.com/jquery.js', 'jQuery', function() { // Load everything else when it is done.
            jQuery.noConflict();
            importJS('https://dv0akt2986vzh.cloudfront.net/stable/vendor/diff/diff_match_patch.js', 'diff_match_patch', function() {
                importJS('https://dv0akt2986vzh.cloudfront.net/stable/lib/dom.js', 'DomPredictionHelper', function() {
                    importJS('https://cdnjs.cloudflare.com/ajax/libs/json3/3.2.4/json3.min.js', 'JSON', function(){});
                    jQuery("button").unbind();
                    selectionBuilder = new DomPredictionHelper();
                    if ("CONTACT_STORAGE_DATA" in window.localStorage && window.localStorage["CONTACT_STORAGE_DATA"] && window.localStorage["CONTACT_STORAGE_DATA"] != "") {
                        initializeSuccessMessageSelectionProcess();
                    } else {
                        initializeContactFormSelectionProcess();
                    }
                });
            });
        });
    }
    
    function isElementRequired($targetElement) {
        var retVal = false;
        $targetElement.css({
            "border": "solid 2px black", 
            "boxShadow": "0 0 5px 3px rgba(100,100,200,0.4)" 
        });
        if (confirm("Is this element required? (OK = Yes, Cancel = No)")) {
            retVal = true;
        }
        $targetElement.css({
            "border": "", 
            "boxShadow": "" 
        });
        return retVal;
    }
    
    function elementClicked(evt) {
        evt.preventDefault();
        var $targetElement = jQuery(this),
            elementRequired;
        if (currentStep == steps.DOUBLECHECK) {
            if ($targetElement.hasClass(myButtonClass)) {
                return true;
            } else {
                return false;
            }
        }
        if (currentStep == steps.SUBMIT) {
            alert("This alert is a hack to prevent the form from automatically submitting when you pressed that button")
            elementRequired = true;
        } else {
            elementRequired = isElementRequired($targetElement);
        }

        $targetElement.data("required", elementRequired);
        fillInFillerData($targetElement);
        $elements[currentStep] = $targetElement;
        var identifyingElement = jQuery("<span />")
            .text(desiredElementDescription + " (" + (elementRequired ? "" : "not ") + "required) :")
            .attr("id", "identifying_element_" + currentStep);
        $targetElement
            .before(identifyingElement);
        jQuery("input, select, textarea")
            .unbind();
        setTimeout(nextStep);
        return false;
    }
    
    function tellUserToClickInputElement() {
        $workingSpace.text("Please click the '" + desiredElementDescription + "' input element");
        jQuery("input, select, textarea")
            .unbind()
            .bind("mousedown", elementClicked);
    }

    String.prototype.has = function(str) {
        return this.indexOf(str) > -1;
    }
    
    function nextStep() {
        currentStep++;
        var html = jQuery("html").html().toLowerCase();
        switch (currentStep) {
            case steps.GENDER:
                if (html.match(/gender|prefix|salutation/i)) {
                    desiredElementDescription = "gender/prefix";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.FIRST_NAME:
                if (html.has("first name")) {
                    desiredElementDescription = "first name";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.LAST_NAME:
                if (html.has("last name")) {
                    desiredElementDescription = "last name";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.ADDRESS: 
                if (html.has("address")) {
                    desiredElementDescription = "address";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.ADDRESS2: 
                if (html.has("address")) {
                    desiredElementDescription = "address second line";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.CITY: 
                if (html.has("city")) {
                    desiredElementDescription = "city";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.COUNTY:
                if (html.has("county")) {
                    desiredElementDescription = "county";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.STATE: 
                if (html.has("state")) {
                    desiredElementDescription = "state";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.ZIPCODE: 
                if (html.has("zip") || html.has("postal")) {
                    desiredElementDescription = "zip";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.PHONE: 
                if (html.has("phone")) {
                    desiredElementDescription = "phone";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.WORK_PHONE: 
                if (html.has("work phone")) {
                    desiredElementDescription = "work phone";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.EMAIL: 
                desiredElementDescription = "email";
                tellUserToClickInputElement();
                break;
            case steps.VERIFYEMAIL: 
                if (html.match(/verify|re-enter/i)) {
                    desiredElementDescription = "verify email";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.MESSAGETOPIC: 
                if (html.match(/topic|issue/i)) {
                    desiredElementDescription = "message topic";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.MESSAGESUBJECT: 
                if (html.has("subject")) {
                    desiredElementDescription = "message subject";
                    tellUserToClickInputElement();
                } else {
                    nextStep();
                    break;
                }
                break;
            case steps.MESSAGE: 
                desiredElementDescription = "message body";
                tellUserToClickInputElement();
                break;
            case steps.CAPTCHATEXT:
                //if (html.has("captcha")) {
                //    desiredElementDescription = "captcha text";
                //    tellUserToClickInputElement();
                //} else {
                    nextStep();
                //    break;
                //}
                break;
            case steps.CAPTCHAIMAGE:
                //if (html.has("captcha")) {
                //    desiredElementDescription = "captcha image";
                //    tellUserToClickInputElement();
                //} else {
                    nextStep();
                //    break;
                //}
                //$workingSpace.text("Please click the actual captcha image");
                break;
            case steps.WANT_RESPONSE:
                desiredElementDescription = "'would you like a response?'";
                tellUserToClickInputElement()
                break;
            case steps.SUBMIT: 
                desiredElementDescription = "submit";
                tellUserToClickInputElement();
                break;
            case steps.DOUBLECHECK:
                $workingSpace.text("Please double-check your selections and press Next");
                $workingButton.text("Next");
                break;
        }
    }
    
    go();
})();
