'use strict';

//private メソッド化
const setWindowAction = Symbol(); 
const updateTitle = Symbol();
const getMonth = Symbol();
const render = Symbol();
const pushData = Symbol();

class Calender {

    constructor(){
        this.CalendarGrouping = {};
        this.DataView = {};
        this.UserData = [];
        this.monthEventTemplate = `<div><div data-column = "card" class="smallIcon"></div></div>`;
        this.presenter = `<img style ="width:100%;height:100%" src="{{=it.card}}"/>`;
        this.columns = [{
            id: 'name',
            caption: 'name',
            dataField: 'name'
        }, {
            id: 'card',
            caption: 'card',
            dataField: 'card',
            presenter: this.presenter
        }, {
            id: 'date',
            caption: 'date',
            dataField: 'date'
        }];
    }

    init(socket){
        socket.onOpen( ev => console.log("OPEN", ev) )
        socket.onError( ev => console.log("ERROR", ev) )
        socket.onClose( ev => console.log("CLOSE", ev))
        const chan = socket.channel("chat:lobby", {})
        
        // チャネルからnew_msgという種類のメッセージを受信した時の処理
        chan.on("new_msg", msg => {
            console.log(msg);
            this[pushData](msg.body);
            this[render]();
        });

        $(document).ready(this[render]('init')); //初期描画
        this[setWindowAction](this.CalendarGrouping); //dom系処理を有効に
    }

    //ページ移動系処理
    [setWindowAction](){
        //リサイズ処理
        const resize = () => {
            if (this.dataView) {
                const options = this.dataView.options;
                const strategy = options.groupStrategy;
                const strategyOptions = strategy.options;
                if (strategyOptions.viewMode === "Month") {
                    options.cardHeight = 56;
                    options.cardWidth = 56;
                    options.rowTemplate = this.monthEventTemplate;
                }
                this.dataView.invalidate();
            }
        }

        //前へボタン
        const previous = () => {
            const options = this.CalendarGrouping.options;
            let currentDate = options.startDate;
            currentDate = this[getMonth](currentDate, -1);
            this.CalendarGrouping.options.startDate = currentDate;
            this[updateTitle]();
            this.dataView.invalidate();
        }
        
        //次へボタン
        const next = () => {
            const options = this.CalendarGrouping.options;
            let currentDate = options.startDate;
            currentDate = this[getMonth](currentDate, 1);
            this.CalendarGrouping.options.startDate = currentDate;
            this[updateTitle]();
            this.dataView.invalidate();
        }

        $('#btn-next').on('click', next);
        $('#btn-previous').on('click', previous);
        $(window).resize(resize);
    }

    //タイトルの更新
    [updateTitle](){
        const options = this.CalendarGrouping.options;
        const date = options.startDate;
        const $title = document.getElementById("title");
        const dateFormatter = new GC.Spread.Formatter.GeneralFormatter('mmmm yyyy');
        $title.innerText = dateFormatter.format(date);
    }

    //月を取得
    [getMonth](currentDate, monthCount){
        const day = currentDate.getDate();
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + monthCount;
        if (month == 12) {
            month = 0;
            year += 1;
        } else if (month == -1) {
            month = 11;
            year -= 1;
        }
        console.log(new Date(year, month, day, 0, 0, 0));
        return new Date(year, month, day, 0, 0, 0);
    }

    //データの追加
    [pushData](name){
        const now = new Date();
        this.UserData.push({
            name: name,
            card: `./images/${name}.png`,
            date: new Date(now.getFullYear(), now.getMonth(), 1)
        });
    }

    //レンダリング
    [render](flag = ''){
        if(flag === 'init') this[pushData]('n0bisuke');
        const sourceData = this.UserData;
        this.CalendarGrouping = new GC.Spread.Views.Plugins.CalendarGrouping({});
        this.CalendarGrouping.eventLimitClick.addHandler((sender, args) => {
            const options = sender.options;
            options.cardHeight = 100;
            options.cardWidth = 100;
            options.rowTemplate = '<div><div data-column = "card" class="bigIcon"></div></div>';
        });

        this.CalendarGrouping.popoverClose.addHandler((sender, args) => {
            const options = sender.options;
            options.cardHeight = 56;
            options.cardWidth = 56;
            options.rowTemplate = this.monthEventTemplate;
            sender.invalidate();
        });

        this.dataView = new GC.Spread.Views.DataView(document.getElementById('grid1'), sourceData, this.columns, new GC.Spread.Views.Plugins.CardLayout({
            cardHeight: 56,
            cardWidth: 56,
            grouping: {
                field: 'date',
                converter: (field) =>  field.toDateString()
            },
            rowTemplate: this.monthEventTemplate,
            groupStrategy: this.CalendarGrouping
        }));
        this[updateTitle]();
    }
}

export default Calender