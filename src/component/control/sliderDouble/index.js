import { state } from '../../state';
import { data } from '../../data';
import { bookmark } from '../../bookmark';

import * as form from '../../form';

import { Button } from '../../button';
import { Collapse } from '../../collapse';
import { Control_slider } from '../slider';

import { node } from '../../../utility/node';
import { get } from '../../../utility/get';
import { set } from '../../../utility/set';
import { convertColor } from '../../../utility/convertColor';
import { isValidString } from '../../../utility/isValidString';
import { minMax } from '../../../utility/minMax';

export const Control_sliderDouble = function({
  object = {},
  labelText = 'Name',
  left = {
    path: false,
    id: 'name',
    labelText: 'Name',
    hue: false,
    value: 0,
    defaultValue: false,
    min: 0,
    max: 100,
    step: 1,
    action: false,
    focusAction: false,
    blurAction: false,
    sliderAction: false,
    numberAction: false,
    resetAction: false,
    mouseDownAction: false,
    mouseUpAction: false
  },
  right = {
    path: false,
    id: 'name',
    labelText: 'Name',
    hue: false,
    value: 0,
    defaultValue: false,
    min: 0,
    max: 100,
    step: 1,
    action: false,
    focusAction: false,
    blurAction: false,
    sliderAction: false,
    numberAction: false,
    resetAction: false,
    mouseDownAction: false,
    mouseUpAction: false
  }
} = {}) {

  this.label = form.label({
    forInput: left.id,
    text: labelText
  });

  this.range = {
    left: new Control_slider({
      object: object,
      path: left.path,
      id: left.id,
      labelText: left.labelText,
      hue: left.hue,
      value: left.value,
      defaultValue: left.defaultValue,
      min: left.min,
      max: left.max,
      step: left.step,
      action: () => {

        if (get({ object: state.get.current(), path: left.path }) > get({ object: state.get.minMax(), path: left.path }).max - 10) {
          set({ object: state.get.current(), path: left.path, value: get({ object: state.get.minMax(), path: left.path }).max - 10 })
        };

        if (get({ object: state.get.current(), path: left.path }) >= get({ object: state.get.current(), path: right.path }) - 10) {
          set({ object: state.get.current(), path: right.path, value: get({ object: state.get.current(), path: left.path }) + 10 })
        };

        this.range.left.updateRange();

        this.range.right.update();

        if (left.action) {
          left.action();
        };

      },
      focusAction: left.focusAction,
      blurAction: left.blurAction,
      sliderAction: left.sliderAction,
      numberAction: left.numberAction,
      resetAction: left.resetAction,
      mouseDownAction: left.mouseDownAction,
      mouseUpAction: left.mouseUpAction
    }),
    right: new Control_slider({
      object: object,
      path: right.path,
      id: right.id,
      labelText: right.labelText,
      hue: right.hue,
      value: right.value,
      defaultValue: right.defaultValue,
      min: right.min,
      max: right.max,
      step: right.step,
      action: () => {

        if (get({ object: state.get.current(), path: right.path }) < get({ object: state.get.minMax(), path: right.path }).min + 10) {
          set({ object: state.get.current(), path: right.path, value: get({ object: state.get.minMax(), path: right.path }).min + 10 })
        };

        if (get({ object: state.get.current(), path: right.path }) <= get({ object: state.get.current(), path: left.path }) + 10) {
          set({ object: state.get.current(), path: left.path, value: get({ object: state.get.current(), path: right.path }) - 10 })
        };

        this.range.left.update();

        this.range.right.updateRange();

        if (right.action) {
          right.action();
        };

      },
      focusAction: right.focusAction,
      blurAction: right.blurAction,
      sliderAction: right.sliderAction,
      numberAction: right.numberAction,
      resetAction: right.resetAction,
      mouseDownAction: right.mouseDownAction,
      mouseUpAction: right.mouseUpAction
    })
  };

  this.wrap = () => {

    const leftNumberReset = form.group({
      children: [
        this.range.left.number
      ]
    });

    if (left.defaultValue || (typeof left.defaultValue === 'number' && left.defaultValue === 0)) {
      leftNumberReset.prepend(this.range.left.reset.button);
    };

    const rightNumberReset = form.group({
      children: [
        this.range.right.number
      ]
    });

    if (right.defaultValue || (typeof right.defaultValue === 'number' && right.defaultValue === 0)) {
      rightNumberReset.appendChild(this.range.right.reset.button);
    };

    const wrap = form.wrap({
      children: [
        form.wrap({
          children: [
            this.label,
            node('div|class:slider-double', [
              this.range.left.range,
              this.range.right.range
            ])
          ]
        }),
        form.wrap({
          children: [
            form.group({
              block: true,
              justify: 'space-between',
              children: [
                leftNumberReset,
                rightNumberReset
              ]
            })
          ]
        })
      ]
    });

    return wrap;

  };

  this.delayedUpdate = null;

  this.update = ({
    delay = false
  } = {}) => {

    const updateControl = () => {
      this.range.left.update();
      this.range.right.update();
    };

    if (delay) {
      clearTimeout(this.delayedUpdate);
      this.delayedUpdate = setTimeout(updateControl, 2000);
    } else {
      updateControl();
    };

  };

};