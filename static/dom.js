
let dom = {


    numOfData : 62,
    tableHeader : ['Name', 'Diameter', 'Climate', 'Terrain', "Surface Water Percentage", 'Population', 'Residents', ''],
    dataTitle : ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population'],
    counter : 0,
    planets : [],
    residents : [],
    modalTableHeader : ['Name', 'Height', 'Mass', 'Skin Color', 'Hair Color', 'Eye Color', 'Birth Year', 'Gender' ],
    modalDataTitle : ['name', 'height', 'mass', 'skin-color', 'hair_color', 'eye_color', 'birth_year', 'gender'],

    getData: function() {


        for (let i = 1; i < dom.numOfData; i++) {
            $.ajax({
                dataType: "json",
                url: 'https://swapi.co/api/planets/' + i.toString(),
                success: function (response) {
                    dom.planets.push(response);
                    dom.addNewRow(dom.makeModal); //TODO: Ez itt rossz helyen van...
                }
            });
        }
    },


    addNewRow: function (callback) {
        let pName = document.createElement("td");
        pName.innerText = dom.planets[dom.counter]['name'];
        document.getElementById('row' + dom.counter.toString()).appendChild(pName);

        let pDiameter = document.createElement("td");
        pDiameter.innerText = dom.planets[dom.counter]['diameter'];
        document.getElementById('row' + dom.counter.toString()).appendChild(pDiameter);

        let pClimate = document.createElement("td");
        pClimate.innerText = dom.planets[dom.counter]['climate'];
        document.getElementById('row' + dom.counter.toString()).appendChild(pClimate);

        let pTerrain = document.createElement("td");
        pTerrain.innerText = dom.planets[dom.counter]['terrain'];
        document.getElementById('row' + dom.counter.toString()).appendChild(pTerrain);

        let pSurfaceWater = document.createElement("td");
        pSurfaceWater.innerText = dom.planets[dom.counter]['surface_water'];
        document.getElementById('row' + dom.counter.toString()).appendChild(pSurfaceWater);

        let pPopulation = document.createElement("td");
        if (dom.planets[dom.counter]['population'] === 'unknown') {
            pPopulation.innerText = dom.planets[dom.counter]['population'];
            document.getElementById('row' + dom.counter.toString()).appendChild(pPopulation)
        } else {
            let formattedPop = Intl.NumberFormat().format(parseInt(dom.planets[dom.counter]['population']));
            pPopulation.innerText = formattedPop.slice(0, 9).concat(".").concat(formattedPop.slice(10, 12));
            document.getElementById('row' + dom.counter.toString()).appendChild(pPopulation);
        }

        if (dom.planets[dom.counter]['residents'].length > 0){
            let pResidentsButton = document.createElement('button');
            pResidentsButton.id = 'ResidentButton' + dom.counter.toString();
            pResidentsButton.innerText = 'Residents';
            document.getElementById('row' + dom.counter.toString()).appendChild(pResidentsButton);
            //document.getElementById('ResidentButton' + dom.counter.toString()).appendChild(pResidents);

            pResidentsButton.addEventListener("click", function () {
                let target = event.target;
                let targetId =target.id;
                let rowCounter = targetId.slice(14);
                let residentCounter = 0;
                for (let oneResident of dom.planets[rowCounter]['residents']) {
                    $.ajax({
                        dataType: "json",
                        url: oneResident,
                        success: function (response) {
                            dom.residents.push(response);
                            residentCounter += 1;
                        }
                    });
                }
                callback(residentCounter, rowCounter)
            })
        } else {
            let pResidents = document.createElement('td');
            pResidents.id = 'Resident' + dom.counter.toString();
            document.getElementById('row' + dom.counter.toString()).appendChild(pResidents)
          }


        dom.counter += 1
        },




    makeModal: function(residentCounter, rowCounter) {

        let modal = document.createElement('div');
        modal.id = 'modal';
        modal.className = "modal";
        modal.tabIndex = "-1";
        modal.role = "dialog";
        document.getElementById('container').appendChild(modal);

        let modalDialog = document.createElement('div');
        modalDialog.className = "modal-dialog";
        modalDialog.id = 'modal-dialog' + rowCounter.toString();
        modalDialog.role = "document";
        document.getElementById('modal').appendChild(modalDialog);

        let modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.id = 'modal-content' + rowCounter.toString();
        document.getElementById('modal-dialog' + rowCounter.toString()).appendChild(modalContent);

        let modalHeader = document.createElement('div');
        modalHeader.className = "modal-header";
        modalHeader.id = "modal-header" + rowCounter.toString();
        document.getElementById('modal-content' + rowCounter.toString()).appendChild(modalHeader);

        let closingButton = document.createElement('button');
        closingButton.type = "button";
        closingButton.className = "close";
        closingButton.id = "closingButton" + rowCounter.toString();
        closingButton.setAttribute("data-dismiss", 'modal');
        closingButton.setAttribute("aria-hidden", "true");
        closingButton.setAttribute("value", "Close");
        document.getElementById('modal-header' + rowCounter.toString()).appendChild(closingButton);

        let closingCross = document.createElement('span');
        closingCross.setAttribute('aria-hidden', 'true');
        closingCross.innerText = 'X';
        closingCross.id = 'closingCross';
        document.getElementById('closingButton' + rowCounter.toString()).appendChild(closingCross);

        let modalBody = document.createElement('div');
        modalBody.className = "modal-body";
        modalBody.id = "modalBody";
        document.getElementById('modal-content' + rowCounter.toString()).appendChild(modalBody);

        let modalTable = document.createElement('table');
        modalTable.className = 'table table-dark';
        modalTable.id = 'modal-table';
        document.getElementById('modalBody').appendChild(modalTable);

        let tableHeader = document.createElement('thead');
        tableHeader.id = 'table-head';
        document.getElementById('modal-table').appendChild(tableHeader);

        let tableHeaderRow = document.createElement('TR');
        tableHeaderRow.id = "head-row";
        document.getElementById('table-head').appendChild(tableHeaderRow);

        for (let header of dom.modalTableHeader ) {
            let tableHeaderTitle = document.createElement('th');
            tableHeaderTitle.innerText = header;
            document.getElementById('head-row').appendChild(tableHeaderTitle)
        }

        let tableBody = document.createElement('tbody');
        tableBody.id = 'table-body';
        document.getElementById('modal-table').appendChild(tableBody);

        for (let i = 0; i <= residentCounter; i++) {
            let tableRow = document.createElement('TR');
            tableRow.id = 'table-row' + i.toString();
            document.getElementById('table-body').appendChild(tableRow);
            for (data of dom.modalDataTitle) {
                let tableData = document.createElement('TD');
                tableData.innerText = dom.residents[residentCounter][data];
                document.getElementById('table-row' + residentCounter.toString()).appendChild(tableData)
        }}
        dom.activateModal(rowCounter);

    },

    activateModal: function (rowCounter) {

//TODO: kétszer kell kattintani a button-ra hogy elinduljon!
        let modal = document.getElementById('modal');
        let button = document.getElementById('ResidentButton' + rowCounter.toString());
        let span = document.getElementById('closingButton' + rowCounter.toString());
        button.onclick = function() {
            modal.style.display = "block"
        };
        span.onclick = function() {
            modal.style.display = "none";
        }

    }


        //residents: function () {




            //;
            //pName.innerText = name[i];
            //document.getElementById('row' + i.toString()).appendChild(pName);


            //why couldn't I start a new for loop?

        //buildRow: function () {
        //    for (let i = 0; i < numOfData.length; i++) {
        //      let row = document.createElement('tr');
        //    row.innerText = "";
        //class
        //       row.id = 'row' + i.toString();
        //      document.getElementById(tableHeader[1]).appendChild(row);
        //}}}


};

function init() {
    dom.getData();
}

init();
