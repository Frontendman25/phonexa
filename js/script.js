'use strict'

$(function() {
  var wrapper = document.querySelector('.wrapper')
  var formRegistration = document.querySelector('#formRegistration')
  var formSpecalization = document.querySelector('#formSpecalization')
  var checkInfo = document.querySelector('.check-info')
  var editBtn = document.querySelector('.check-info__btn_edit')
  var sendBtn = document.querySelector('.check-info__btn_send')
  var thanks = document.querySelector('.thanks')
  var dataFromForms = {}
  $('.departments').selectric()
  $('.vacancy').selectric() // Animate disappeareance block

  var toggleAppeareance = function toggleAppeareance(element, appeareance) {
    if (appeareance === 'disappear') {
      wrapper.style.overflow = 'hidden'
      element.classList.remove('animateAppear')
      element.classList.add('animateDisappear')
      setTimeout(function() {
        element.style.display = 'none'
      }, 500)
      return
    } else if (appeareance === 'appear') {
      element.classList.remove('animateDisappear')
      element.classList.add('animateAppear')
      setTimeout(function() {
        element.style.display = 'block'
      }, 500)
      setTimeout(function() {
        wrapper.style.overflow = 'auto'
      }, 1000)
      return
    }
  } // Validate formRegistration

  $.validator.addMethod(
    'regex',
    function(value, element, param) {
      return this.optional(element) || param.test(value)
    },
    'Letters only'
  )
  $('#formRegistration').validate({
    submitHandler: function submitHandler(form, e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false)
      var serializedArray = $(form).serializeArray()
      $.map(serializedArray, function(n, i) {
        dataFromForms[n['name']] = n['value']
      })
      toggleAppeareance(form, 'disappear')
      toggleAppeareance(formSpecalization, 'appear')
    },
    rules: {
      name: {
        required: true,
        regex: /^[a-zA-Z]+$/
      },
      last_name: {
        required: true,
        regex: /^[a-zA-Z]+$/
      },
      login: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        regex: /((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W)\w.)/
      },
      password_confirmation: {
        required: true,
        equalTo: '#password'
      }
    },
    messages: {
      password:
        'Required at least one number (0-9), uppercase and lowercase letters (a-Z), and at least one special character (!@#$%^&*~)',
      password_confirmation: 'Must be equal to password'
    }
  }) // Work whith <select></select>

  var departments = document.querySelector('.departments')
  var vacancy = document.querySelector('.vacancy')
  var isGetData = false

  var fillCheckInfoBlock = function fillCheckInfoBlock() {
    var name = dataFromForms.name,
      login = dataFromForms.login,
      email = dataFromForms.email,
      company_name = dataFromForms.company_name,
      departments = dataFromForms.departments,
      vacancy = dataFromForms.vacancy
    return '\n      <h3 class="check-info__caption">Name: <span class="check-info__value">'
      .concat(
        name,
        '</span>\n      </h3>\n      <h3 class="check-info__caption">Login: <span class="check-info__value">'
      )
      .concat(
        login,
        '</span>\n      </h3>\n      <h3 class="check-info__caption">Email: <span class="check-info__value">'
      )
      .concat(
        email,
        '</span>\n      </h3>\n      <h3 class="check-info__caption">Company: <span class="check-info__value">'
      )
      .concat(
        company_name,
        '</span>\n      </h3>\n      <h3 class="check-info__caption">Departmant: <span class="check-info__value">'
      )
      .concat(
        departments,
        '</span>\n      </h3>\n      <h3 class="check-info__caption">Job Title: <span class="check-info__value">'
      )
      .concat(vacancy, '</span>\n      </h3>\n    ')
  } // departments.addEventListener('click', function(e) {

  $('.departments').on('selectric-before-open', function(e) {
    if (!isGetData) {
      $('#departmentsError, #vacancyError').css({ display: 'none' })

      var _departments = Object.keys(data.departments)

      var options = ''

      _departments.forEach(function(key) {
        options += '<option>'.concat(key, '</option>')
      })

      this.innerHTML = options
      isGetData = true
      var _data = data,
        departmentsData = _data.departments
      var selected = $('.departments')
        .children('option:selected')
        .text()
      var currentVacancy = departmentsData[selected]
      var optionsData = ''
      vacancy.disabled = false
      currentVacancy.forEach(function(el) {
        optionsData += '<option>'.concat(el, '</option>')
      })
      vacancy.innerHTML = optionsData
      $('.departments')
        .change()
        .selectric('refresh')
      $('.vacancy')
        .change()
        .selectric('refresh')
    }
  })
  $('.departments').on('selectric-change', function() {
    var _data2 = data,
      departments = _data2.departments
    var selected = $(this)
      .children('option:selected')
      .text()
    var currentVacancy = departments[selected]
    var options = ''
    vacancy.disabled = false
    currentVacancy.forEach(function(el) {
      options += '<option>'.concat(el, '</option>')
    })
    vacancy.innerHTML = options
    $('.vacancy')
      .change()
      .selectric('refresh')
  }) // Edit button click

  editBtn.addEventListener('click', function(e) {
    toggleAppeareance(checkInfo, 'disappear')
    toggleAppeareance(formRegistration, 'appear')
  }) // Send button click

  sendBtn.addEventListener('click', function(e) {
    localStorage.setItem('infoFromForms', JSON.stringify(dataFromForms))
    toggleAppeareance(checkInfo, 'disappear')
    toggleAppeareance(thanks, 'appear')
    formRegistration.reset()
    formSpecalization.querySelector('.form__field_select').innerHTML =
      '\n      <select class="departments" name="departments">\n        <option selected disabled>Departments</option>\n      </select>\n      <select class="vacancy" name="vacancy" disabled>\n        <option selected disabled>Vacancy</option>\n      </select>\n    '
  }) // Validate formSpecalization

  $('#formSpecalization').validate({
    submitHandler: function submitHandler(form, e) {
      e.preventDefault()
      var serializedArray = $(form).serializeArray()
      $.map(serializedArray, function(n, i) {
        dataFromForms[n['name']] = n['value']
      })
      checkInfo.querySelector(
        '.check-info__info'
      ).innerHTML = fillCheckInfoBlock()
      toggleAppeareance(form, 'disappear')
      toggleAppeareance(checkInfo, 'appear')
    },
    rules: {
      departments: {
        required: true
      },
      vacancy: {
        required: true
      }
    }
  })

  $('.formSpecalizationBtn').on('click', function(e) {
    if (!$('#formSpecalization').valid()) {
      e.preventDefault()
      $('#departmentsError, #vacancyError').css({ display: 'block' })
    } else {
      $('#departmentsError, #vacancyError').css({ display: 'none' })
    }
  })
})
