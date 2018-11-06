'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

function getEvent(event) {
    let events = [];
    let eventsArray = event.split('.');
    events.push(eventsArray[0]);
    for (let i = 1; i < eventsArray.length; i++) {
        events.push(events[events.length - 1] + '.' + eventsArray[i]);
    }

    return events.reverse();
}

function isSubscribe(...parameters) {
    let [subscribe, event, student, handler, total, frequency] = parameters;
    let obj = { 'student': student, 'handler': handler, 'total': total, 'frequency': frequency };
    if (subscribe.hasOwnProperty(event)) {
        subscribe[event].students.push(obj);
    } else {
        subscribe[event] = {
            'total': 0,
            students: [obj] };
    }
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    let subscribe = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            console.info(event, context, handler);
            isSubscribe(subscribe, event, context, handler, Infinity, 1);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            console.info(event, context);
            let events = [];
            if (subscribe.hasOwnProperty(event)) {
                events.push(event);
            }
            for (let name of Object.keys(subscribe)) {
                if (events.length > 0 && name.indexOf(event) === 0) {
                    events.push(name);
                }
            }
            for (let eventOf of events) {
                subscribe[eventOf].students =
                subscribe[eventOf].students.filter(student => student.student !== context);
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            console.info(event);
            let events = getEvent(event);
            for (let element of events) {
                if (!subscribe.hasOwnProperty(element)) {
                    continue;
                }
                subscribe[element].total += 1;
                subscribe[element].students.forEach(student => {
                    let number =
                    1 + (Math.floor(subscribe[element].total / student.frequency) *
                    student.frequency);
                    if (student.total > 0 && (student.frequency === 1 ||
                        number === subscribe[element].total)) {
                        student.handler.call(student.student);
                        student.total -= 1;
                    }
                });
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
            times = times < 0 ? Infinity : times;
            isSubscribe(subscribe, event, context, handler, times, 1);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
            frequency = frequency < 0 ? 1 : frequency;
            isSubscribe(subscribe, event, context, handler, Infinity, frequency);

            return this;
        }
    };
}

module.exports = {
    getEmitter,
    getEvent,
    isSubscribe,

    isStar
};
