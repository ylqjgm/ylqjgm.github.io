/** @format */

var $posts = {
  scroller: function () {
    function Scroller() {
      this.callbacks = []
      return this
    }
    Scroller.prototype.bindScrollEvent = function () {
      var _that = this

      window.addEventListener('scroll', function (event) {
        var wait = false
        var beforeOffsetY = window.pageYOffset

        if (wait) return
        wait = true

        setTimeout(function () {
          var params = {
            event: event,
            beforeOffsetY: beforeOffsetY,
          }
          _that.callbacks.forEach(function (func) {
            func(params)
          })

          wait = false
        }, 150)
      })
    }

    return Scroller
  },
  showTopic: function (evt) {
    var topicEl = document.getElementById('postTopic')
    var postTitle = document.getElementById('postTitle')

    var postTitleCoordinate = postTitle.getBoundingClientRect()
    var threshold = postTitle.offsetTop + postTitleCoordinate.height

    // show title
    if (window.pageYOffset > threshold) {
      var beforeOffsetY = evt && evt.beforeOffsetY
      var isScrollToTop = beforeOffsetY - window.pageYOffset > 0

      topicEl.classList.remove('is-hidden-topic-bar')

      if (beforeOffsetY - window.pageYOffset === 0) {
        topicEl.classList.remove('is-switch-post-title')
        topicEl.classList.remove('is-show-post-title')
        topicEl.classList.remove('immediately-show')

        if (topicEl.classList.contains('is-show-scrollToTop-tips')) {
          topicEl.classList.remove('is-show-scrollToTop-tips')
          topicEl.classList.add('is-flash-scrollToTop-tips')
        } else {
          topicEl.classList.add('immediately-show')
        }
      }
      // scroll to up👆
      else if (isScrollToTop) {
        // show scroll to top tips
        if (window.pageYOffset > window.innerHeight * 2) {
          topicEl.classList.remove('immediately-show')
          topicEl.classList.remove('is-show-post-title')
          topicEl.classList.remove('is-switch-post-title')
          topicEl.classList.remove('is-flash-scrollToTop-tips')

          topicEl.classList.add('is-show-scrollToTop-tips')
        }
        // show post title
        else {
          topicEl.classList.remove('immediately-show')
          topicEl.classList.remove('is-show-post-title')
          topicEl.classList.remove('is-show-scrollToTop-tips')
          topicEl.classList.remove('is-flash-scrollToTop-tips')

          topicEl.classList.add('is-switch-post-title')
        }
      }
      // scroll to down👇
      else if (beforeOffsetY - window.pageYOffset !== 0) {
        topicEl.classList.remove('immediately-show')
        topicEl.classList.remove('is-switch-post-title')
        topicEl.classList.remove('is-show-scrollToTop-tips')
        topicEl.classList.remove('is-flash-scrollToTop-tips')
        topicEl.classList.add('is-show-post-title')
      }
    } else {
      // hidden all
      topicEl.classList.remove('is-flash-scrollToTop-tips')
      topicEl.classList.remove('is-show-scrollToTop-tips')
      topicEl.classList.remove('is-switch-post-title')
      topicEl.classList.remove('is-show-post-title')
      topicEl.classList.remove('immediately-show')

      topicEl.classList.add('is-hidden-topic-bar')
    }
  },
  smoothScrollToTop: function () {
    var Y_TopValve =
      window.pageYOffset ||
      document.body.scrollTop ||
      document.documentElement.scrollTop
    if (Y_TopValve > 1) {
      window.requestAnimationFrame($posts.smoothScrollToTop)
      scrollTo(0, Math.floor(Y_TopValve * 0.85))
    } else {
      scrollTo(0, 0)
    }
  },
  addValineComment() {
    var el = document.getElementById('vcomments')
    new Valine({
      el: '#vcomments',
      appId: el.dataset.comment_valine_id,
      appKey: el.dataset.comment_valine_key,
    })
  },
  mounted: function () {
    var Scroller = this.scroller()
    var scrollerInstance = new Scroller()

    scrollerInstance.callbacks.push(this.showTopic)

    scrollerInstance.bindScrollEvent()

    $claudia.fadeInImage(document.querySelectorAll('.post-content img'))

    document
      .getElementById('postTopic')
      .addEventListener('click', this.smoothScrollToTop)

    window.Valine && this.addValineComment()
  },
}

$posts.mounted()
