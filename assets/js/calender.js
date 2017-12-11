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
        this.DSMEMBERS = ['n0bisuke','chantoku','uko','chachamaru','romrom','wami','taka'];
    }

    init(socket){
        const chan = socket.channel("chat:lobby", {})
        chan.join()
            .receive("ignore", () => console.log("auth error"))
            .receive("ok", (messages) => {
                messages.forEach((msg) => {
                    console.log(msg);
                    if(!isNaN(msg.user) && 0 <= msg.user && msg.user <= 31) this[pushData](msg.body, msg.user);
                })
                console.log("join ok")
            })
            .receive("timeout", () => console.log("Connection interruption"))

        // チャネルからnew_msgという種類のメッセージを受信した時の処理
        chan.on("new_msg", msg => {
            const day = msg.user;
            const name = msg.body;

            //存在チェック
            if(this.DSMEMBERS.indexOf(name) == -1){
                console.log(`${name}は存在しません。`);
                return;
            }

            //重複チェック
            for(let i = 0, len = this.UserData.length; i < len; i++){
                if(`${this.UserData[i].date.getDate()}` === day && `${this.UserData[i].name}` === name){
                    console.log(`既に${name}さんは${day}日に出勤登録済みです。`);
                    return;
                }
            }

            this[pushData](name, day);
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

        const previous = () => move(-1); //前へボタン
        const next = () => move(1); //次へボタン

        const move = (step) => {
            const options = this.CalendarGrouping.options;
            let currentDate = options.startDate;
            currentDate = this[getMonth](currentDate, step);
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
        return new Date(year, month, day, 0, 0, 0);
    }

    //データの追加
    [pushData](name, today = 0){
        const now = new Date();
        if(today === 0) today = now.getDate();
        this.UserData.push({
            name: name,
            card: `./images/${name}.png`,
            date: new Date(now.getFullYear(), now.getMonth(), today)
        });
        console.log(`----`);
        
        console.log(this.UserData);
        this[render]();
    }

    //レンダリング
    [render](flag = ''){

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

        if(this.UserData[0] === undefined) return;
        this.dataView = new GC.Spread.Views.DataView(document.getElementById('grid1'), this.UserData, this.columns, new GC.Spread.Views.Plugins.CardLayout({
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