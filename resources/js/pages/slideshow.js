import '../../js/_base'
import moment from 'moment'

packager('app.pages.slideshow')


app.pages.slideshow = new class {

  init() {
    this.groups = [
      {
        label: '王昆队',
        value: 0
      },
      {
        label: '王利刚队',
        value: 0
      },
      {
        label: '冯伟娜队',
        value: 0
      },
      {
        label: '胡建超队',
        value: 0
      },
      {
        label: '樊欣队',
        value: 0
      },
      {
        label: '喻康队',
        value: 0
      }
    ].reverse()

    this.defaultCardTextArray = [
      '春江',
      '花',
      '月夜',
      '风',
      '雪雨雾',
      '夏秋冬',
    ]

    this.initGameProgressChart()

    this.initCards()


    this.$countdownContainer = $('#countdown_container')
    this.$countdownActionContainer = $('#countdown_action_container')
    this.initCountdown()

  }

  // 初始化图表
  initGameProgressChart() {

    this.renderChart()

    $('#game_progress_action_container').on('click', 'button', (e) => {
      e.preventDefault()

      const $button = $(e.currentTarget)

      const index = $button.closest('.group-action').data('group-index')

      if ($button.hasClass('btn-increment')) {
        this.groups[index].value++
      } else {
        if (this.groups[index].value > 0) {
          this.groups[index].value--
        }
      }


      console.log(this.groups)
      this.renderChart()
    })
  }

  renderChart() {
    this.gameProgressChartContainer = document.querySelector('#game_progress_chart')

    const legendData = _.map(this.groups, (v) => v.label)
    const seriesData = _.map(this.groups, (v) => v.value)

    const option = {
      title: {
        text: '游戏得份',
        subtext: '龙途互动'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        data: legendData
      },
      grid: {
        left: '10px',
        right: '140px',
        bottom: '10px',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 20,
        splitNumber: 20
      },
      yAxis: {
        type: 'category',
        data: legendData
      },
      series: [
        {
          name: '得分',
          type: 'bar',
          data: seriesData
        }
      ]
    }

    this.gameProgressChart = echarts.init(this.gameProgressChartContainer)
    this.gameProgressChart.setOption(option)
  }

  rerenderCharts() {
    if (this.gameProgressChart) {
      this.gameProgressChart.destroy()
      this.renderChart()
    }
  }

  initCards() {

    const templateHtml = `
      [[ items.forEach((v, k) => { ]]
        <div class="card-container">
          <div class="card" data-text="[[= v ]]">
              <div class="front">[[= k + 1 ]]</div>
              <div class="back">[[= v ]]</div>
          </div>
        </div>
      [[ }) ]]
    `
    var compiled = _.template(templateHtml)

    const $gameCardContainer = $('#game_cards_container')

    this.cardTextArray = this.getCardTextArray()

    $gameCardContainer.html($(compiled({items: this.cardTextArray})))

    $('.card').off('click').on('click', (e) => {
      $(e.currentTarget).toggleClass('flipped')
      const text = $(e.currentTarget).data('text')
      this.removeCardText(text)
    })
  }


  getCardTextArray() {
    let cardTextArrayStr = localStorage.getItem('card_text_array')
    if (cardTextArrayStr && cardTextArrayStr !== '[]') {
      let cardTextArray = JSON.parse(cardTextArrayStr)
      cardTextArray = _.shuffle(cardTextArray)
      // 每次最多选 6 个
      return cardTextArray.splice(0, 6)
    } else {
      localStorage.setItem('card_text_array', JSON.stringify(this.defaultCardTextArray))
      this.defaultCardTextArray = _.shuffle(this.defaultCardTextArray)
      return this.defaultCardTextArray
    }
  }

  removeCardText(text) {
    const cardTextArray = JSON.parse(localStorage.getItem('card_text_array'))
    cardTextArray.splice(cardTextArray.indexOf(text), 1)
    localStorage.setItem('card_text_array', JSON.stringify(cardTextArray))
  }

  initCountdown() {
    const $btnStart = this.$countdownActionContainer.find('.btn-start')
    const $btnStop = this.$countdownActionContainer.find('.btn-stop')
    const $btnReset = this.$countdownActionContainer.find('.btn-reset')

    let countdownInterval = null
    const countdownMaxNum = 30000
    let countdownNum = countdownMaxNum
    const speed = 10

    this.updateCountdown(countdownNum)

    console.log($btnStart.length)
    $btnStart.on('click', () => {
      if (countdownInterval) {
        return
      }

      countdownNum = countdownMaxNum

      countdownInterval = setInterval(() => {
        countdownNum = countdownNum - 10
        if (countdownNum < 0) {
          clearInterval(countdownInterval)
          return
        }
        this.updateCountdown(countdownNum)
      }, 10)
    })

    $btnStop.on('click', () => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
    })

    $btnReset.on('click', () => {

      clearInterval(countdownInterval)

      if (!countdownInterval) {
        this.updateCountdown(countdownMaxNum)
        return
      }

      countdownNum = countdownMaxNum

      countdownInterval = setInterval(() => {
        countdownNum = countdownNum - 10
        if (countdownNum < 0) {
          clearInterval(countdownInterval)
          return
        }
        this.updateCountdown(countdownNum)
      }, 10)
    })
  }

  updateCountdown(time) {

    console.log('updateCountdown')

    time = moment(time, 'x')

    const templateHtml = `
      <div>
          <span class="second-num">[[= second ]]</span>
          <div class="smalltext">秒</div>
      </div>
      <div>
          <span class="millisecond-num">[[= millisecond ]]</span>
          <div class="smalltext">毫秒</div>
      </div>
    `
    var compiled = _.template(templateHtml)

    this.$countdownContainer.html($(compiled({
      second: time.format('ss'),
      millisecond: time.format('SSS')
    })))
  }
}
