(function () {


    var ajaxLoader = new AjaxLoader('[data-handler=AjaxLoader]');

    //console.log(ajaxLoader);

    $('[data-click]').each(function () {
        var clickaction = $(this).data('click').toString();
        if (clickaction === 'showLoader') {
            $(this).on('click', function () {
                ajaxLoader.ShowLoader();
            });

        } else if (clickaction === 'hideLoader') {
            $(this).on('click', function () {
                ajaxLoader.HideLoader();
            });
        } else if (clickaction === 'getData') {
            $(this).on('click', function () {
                var delay = parseInt($(this).data('delay').toString(), 10);
                getDogData(delay);
            });
        } else if (clickaction === 'overlappingRequests') {
            $(this).on('click', function () {
                overlappingRequests();
            });
        }


    });


    function getDogData(delay) {
        removeDogs();
        ajaxLoader.ShowLoader();
        $.ajax({
            url: '/DogService.asmx/GetData',
            dataType: 'json',
            method: 'GET',
            data: { delay: delay || 0 }
        }).done(function (data) {
            ajaxLoader.HideLoader();
            displayDogs(data);
        });
    }


    function overlappingRequests() {
        getDogData(4000);
        window.setTimeout(function() { getDogData(1000) }, 1000);
    }

    function removeDogs() {
        var list = $('[data-role=DogList]');
        list.empty();

    }

    function displayDogs(data) {
        var list = $('[data-role=DogList]');
        list.empty();
        for (var i = 0; i < data.length; i++) {
            var dog = data[i];
            console.log(dog);
            var dogLi = $('<li/>').addClass('dog');
            dogLi.append($('<h4/>').text(dog.Name));
            dogLi.append($('<p/>').text(dog.BreedName));
            dogLi.append($('<img/>')
                .addClass('portrait')
                .attr('src', dog.Image)
                .attr('alt', dog.BreedName));

            if (dog.Link) {
                var link = $('<a/>').html('Click here &hellip;').attr('href', dog.Link).attr('target', '_blank');
                dogLi.append($('<p/>').append(link));
            }

            list.append(dogLi);
        }
    }

})();




/*
<ul class="dogs-list" data-role="DogList">
            <li class="dog" ng-repeat="dog in dogs" on-last-repeat ng-cloak>
                <h4>
                    {{dog.Name}}
                </h4>
                <p>{{dog.BreedName}}</p>
                <p>Born: <span class="born">{{ jsonDateToDate(dog.Born) | date:'yyyy-MM-dd HH:mm:ss Z'}}</span></p>
                <img class="b-lazy portrait"
                     ng-src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                     data-blazy="{{dog.Image}}"
                     alt="{{dog.BreedName}}" />
                <p ng-show="!!dog.Link">
                    <a target="_blank" href="#" ng-href="{{ dog.Link }}">Click here &hellip;</a>
                </p>
            </li>
        </ul>
 */