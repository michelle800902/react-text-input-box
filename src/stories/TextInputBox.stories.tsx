import React from 'react';
import { storiesOf } from '@storybook/react';
import TextInputBox from '../components/TextInputBox';

const stories = storiesOf('TextInputBox', module);

stories.add('Primary', () => {
    return (
        <TextInputBox />
    );
});
