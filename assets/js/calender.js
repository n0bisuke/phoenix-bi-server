
class Calender {
    static init(socket) {

        var CalendarGrouping;
        var dataView;
        var monthEventTemplate = '<div><div data-column = "card" class="smallIcon"></div></div>';
        var currentArry = [];
        var presenter = '<img style ="width:100%;height:100%" src="{{=it.card}}"/>';
        var columns = [{
            id: 'name',
            caption: 'name',
            dataField: 'name'
        }, {
            id: 'card',
            caption: 'card',
            dataField: 'card',
            presenter: presenter
        }, {
            id: 'date',
            caption: 'date',
            dataField: 'date'
        }];
        
        $('#btn-next').on('click',next);
        $('#btn-previous').on('click',previous);
    
    //after window resize, change the template back
    $(window).resize(function() {
        if (dataView) {
            var options = dataView.options;
            var strategy = options.groupStrategy;
            var strategyOptions = strategy.options;
            if (strategyOptions.viewMode === "Month") {
                options.cardHeight = 56;
                options.cardWidth = 56;
                options.rowTemplate = monthEventTemplate;
            }
            dataView.invalidate();
        }
    });

    const render = () => {
        const sourceData = createData();
        console.log(sourceData)
        CalendarGrouping = new GC.Spread.Views.Plugins.CalendarGrouping({});
        CalendarGrouping.eventLimitClick.addHandler(function(sender, args) {
            var options = sender.options;
            options.cardHeight = 100;
            options.cardWidth = 100;
            options.rowTemplate = '<div><div data-column = "card" class="bigIcon"></div></div>';
        });
        CalendarGrouping.popoverClose.addHandler(function(sender, args) {
            var options = sender.options;
            options.cardHeight = 56;
            options.cardWidth = 56;
            options.rowTemplate = monthEventTemplate;
            sender.invalidate();
        });
        dataView = new GC.Spread.Views.DataView(document.getElementById('grid1'), sourceData, columns, new GC.Spread.Views.Plugins.CardLayout({
            cardHeight: 56,
            cardWidth: 56,
            grouping: {
                field: 'date',
                converter: function(field) {
                    return field.toDateString();
                }
            },
            rowTemplate: monthEventTemplate,
            groupStrategy: CalendarGrouping
        }));
    
        updateTitle();
    }
    
    $(document).ready(render); //初期描画
    
    function getMonth(currentDate, monthCount) {
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth() + monthCount;
        var day = currentDate.getDate();
    
        if (month == 12) {
            month = 0;
            year += 1;
        } else if (month == -1) {
            month = 11;
            year -= 1;
        }
    
        return new Date(year, month, day, 0, 0, 0);
    }
    
    function updateTitle() {
        var options = CalendarGrouping.options;
        var date = options.startDate;
        var title = document.getElementById("title");
        var dateFormatter = new GC.Spread.Formatter.GeneralFormatter('mmmm yyyy');
        title.innerText = dateFormatter.format(date);
    }
    
    function previous() {
        var options = CalendarGrouping.options;
        var currentDate = options.startDate;
        currentDate = getMonth(currentDate, -1);
        CalendarGrouping.options.startDate = currentDate;
        updateTitle();
        dataView.invalidate();
    }
    
    function next() {
        var options = CalendarGrouping.options;
        var currentDate = options.startDate;
        currentDate = getMonth(currentDate, 1);
        CalendarGrouping.options.startDate = currentDate;
        updateTitle();
        dataView.invalidate();
    }
    
    function getDay(currentDate, daysCount) {
        var date = new Date(currentDate);
        var timeSpan = 1000 * 60 * 60 * 24 * (daysCount ? daysCount : 1);
        date.setTime(date.getTime() + timeSpan);
    
        return date;
    }
    
    function createData() {
        var names = ['n0bisuke', 'uko', 'chantoku', 'mao', 'wami', 'chachamaru', 'taka'];
        var data = [];
        var now = new Date();
        var name;
        var factor = 7;
        var date;
        for (var i = 0; i < names.length; i++) {
            for (var j = 0; j < factor; j++) {
                date = getDay(new Date(now.getFullYear(), now.getMonth(), 1), getRandomData(factor * 4));
                name = names[i];
                data.push({
                    name: name,
                    card: './images/' + name + '.png',
                    date: date
                });
            }
            currentArry.length = 0;
        }
    
        return data;
    }
    
    function getRandomData(factor) {
        var dataRandom = Math.floor(Math.random() * factor + 1);
        while (currentArry.indexOf(dataRandom) !== -1) {
            dataRandom = Math.floor(Math.random() * factor + 1);
        }
    
        currentArry.push(dataRandom);
        return dataRandom;
    }

  }
}

export default Calender