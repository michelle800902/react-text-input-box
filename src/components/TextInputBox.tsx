import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface ITagElement {
    value: string;
    error: boolean;
}
interface Props {
    theme: string | 'light' | 'dark';
    color: string;
    limitNum: number;
    name?: string;
    inputValues?: string[];
    placeholder?: string;
    autoFocus?: boolean;
    showErrorTooltip?: boolean;
    checkInputError?: (input: string) => boolean;
    onFocus?: (e?: any) => void;
    onBlur?: (e?: any) => void;
    onChangeInputValues: (tagElements: ITagElement[]) => void;
}

const BoxWrapper = styled.div`
    padding: 24px;
`;
interface BoxContentProps {
    isFocus?: boolean;
    theme: string | 'light' | 'dark';
    color: string;
    error: boolean;
}
const BoxContent = styled.div<BoxContentProps>`
    min-height: 42px;
    margin: 6px 0;
    padding: 4px;
    display: flex;
    flex-flow: wrap;
    align-items: center;
    border-radius: 4px;
    border: ${({ theme }) => (theme === 'dark' ? 'solid 1px #222' : 'solid 1px #ccc')};
    background-color: ${({ theme }) => (theme === 'dark' ? '#222' : '#fff')};
    overflow: auto;
    ${({ color, error, isFocus }) => (
        error
        ? 'border: solid 2px #e60000'
        : isFocus
            ? `
                border-color: ${color};
                box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
            `
            : ''
    )}
`;
interface BoxFooterProps {
    theme: string | 'light' | 'dark';
    error: boolean;
}
const BoxFooter = styled.div<BoxFooterProps>`
    text-align: right;
    color: ${({ error, theme }) => (error ? '#e60000' : (theme === 'dark' ? '#fff' : '#333'))};
`;
interface TagElementProps {
    theme: string | 'light' | 'dark';
    color: string;
    maxWidth: number;
    error: boolean;
}
const TagElement = styled.div<TagElementProps>`
    max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : null)};
    height: 20px;
    margin: 4px;
    padding: 6px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    background-color: ${({ error, theme, color }) => (error ? '#e60000' : (theme === 'dark' ? color : '#eee'))};
    color: ${({ error, theme }) => (error ? '#fff' : (theme === 'dark' ? '#fff' : '#333'))};
    &:hover {
        background-color: ${({ color, error }) => (!error ? color : null)};
        color: ${({ error }) => (!error ? '#fff' : null)};
    }
    > p {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
`;
const DeleteButton = styled.button`
    position: relative;
    padding: 0;
    margin-left: 6px;
    width: 1.2em;
    height: 1.2em;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    font: inherit;
    text-indent: 100%;
    cursor: pointer;
    overflow: hidden;
    &:hover {
        background: #ccc;
    }
    &:before, &:after {
        position: absolute;
        top: 15%; left: calc(50% - .0625em);
        width: .125em; height: 70%;
        border-radius: .125em;
        transform: rotate(45deg);
        background: currentcolor;
        content: ''
    }
    &:after {
        transform: rotate(-45deg);
    }
`;
const InputField = styled.input`
    width: auto;
    height: 26px;
    margin: 4px;
    flex-grow: 1;
    border: 0 none;
    background-color: transparent;
    color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#333')};
    &:focus {
        outline: none;
    }
`;
const ErrorTooltip = styled.div`
    height: 26px;
    padding: 4px 6px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -30px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    background-color: #e60000;
    color: #fff;
`;

const TextInputBox = (props: Props) => {
    const margin = 16;

    const [boxWidth, setBoxWidth] = useState<number>(0);
    const [inputValue, setInputValue] = useState<string>('');
    const [tagElements, setTagElements] = useState<ITagElement[]>([]);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isOver, setIsOver] = useState<boolean>(false);
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [isPaste, setIsPaste] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);

    useEffect(() => {
        const textInputBoxDOM = document.getElementById('textInputBox');
        if (textInputBoxDOM) {
            setBoxWidth(textInputBoxDOM.clientWidth);
        }
    }, []);

    useEffect(() => {
        if (props.inputValues && props.inputValues.length && !tagElements) {
            const initialTagElements = props.inputValues.map((value) => ({
                value,
                error: props.checkInputError ? props.checkInputError(value) : false,
            }));
            setTagElements(initialTagElements);
        }
    }, [props.inputValues]);

    useEffect(() => {
        if (tagElements && tagElements.length) {
            props.onChangeInputValues(tagElements);
            setIsEmpty(!tagElements.length);
            setIsError(tagElements.map((item) => item.error).includes(true));
            setIsOver(tagElements.length > props.limitNum);
            setShowError(true);
        }
    }, [tagElements]);

    const addTagElement = () => {
        if (inputValue.replace(/\s/g, '').length) {
            const currentTagElements = tagElements ? [...tagElements] : [];
            currentTagElements.push({
                value: inputValue,
                error: props.checkInputError ? props.checkInputError(inputValue) : false,
            });
            setTagElements(currentTagElements);
            setInputValue('');
        }
    };

    const createTagElementsFromPaste = (pasteStr: string) => {
        const pasteStrArr = pasteStr.split(/[\s,;]+/);
        const currentTagElements = tagElements ? [...tagElements] : [];
        pasteStrArr.forEach((str) => {
            if (str.length) {
                currentTagElements.push({
                    value: str,
                    error: props.checkInputError ? props.checkInputError(str) : false,
                });
            }
        });
        setTagElements(currentTagElements);
        setInputValue('');
        setIsPaste(false);
    };

    const onClickDelete = (i: number) => {
        const currentTagElements = [...tagElements];
        currentTagElements.splice(i, 1);
        setTagElements(currentTagElements);
    };

    const onChangeInput = (e: any) => {
        if (isPaste) {
            createTagElementsFromPaste(e.target.value);
        } else if (!/[,;]/.test(e.target.value) && e.target.value.replace(/\s/g, '').length) {
            setInputValue(e.target.value);
        } else {
            setInputValue('');
        }
    };

    const onKeyDownInput = (e: any) => {
        // KeyCode: Backspace(8), Tab(9), Enter(13), Space(32), Semicolon(186), Comma(188)
        const splitKeyCodes = [9, 13, 32, 186, 188];
        if (splitKeyCodes.includes(e.keyCode)) {
            if (e.keyCode === 9 && e.currentTarget.value) {
                e.preventDefault();
            }
            addTagElement();
        } else if (e.keyCode === 8 && !e.currentTarget.value && tagElements && tagElements.length) {
            onClickDelete(tagElements.length - 1);
        }
    };

    const onPasteInput = () => {
        setIsPaste(true);
    };

    const onFocusInput = (e: any) => {
        setIsFocus(true);
        props.onFocus && props.onFocus(e);
    };

    const onBlurInput = (e: any) => {
        if (e.currentTarget.value) {
            addTagElement();
        } else {
            setIsFocus(false);
        }
        props.onBlur && props.onBlur(e);
    };

    const renderTagElement = (tagElement: ITagElement, i: number) => (
        <TagElement
            key={i}
            id={`tagElement_${i}`}
            theme={props.theme}
            color={props.color}
            maxWidth={boxWidth - margin}
            error={tagElement.error}
        >
            <p>{tagElement.value}</p>
            <DeleteButton onClick={() => onClickDelete(i)} />
        </TagElement>
    );

    return (
        <BoxWrapper>
            {
                isFocus && (props.showErrorTooltip || showError) && (isEmpty || isError)
                && (
                    <ErrorTooltip>
                        {isEmpty && 'Empty field'}
                        {isError && 'Wrong format'}
                    </ErrorTooltip>
                )
            }
            <BoxContent
                id="textInputBox"
                isFocus={isFocus}
                theme={props.theme}
                color={props.color}
                error={(props.showErrorTooltip || showError) && (isEmpty || isError || isOver)}
            >
                {
                    tagElements && tagElements.map(renderTagElement)
                }
                <InputField
                    theme={props.theme}
                    name={props.name}
                    value={inputValue}
                    autoFocus={props.autoFocus}
                    spellCheck={false}
                    contentEditable={true}
                    placeholder={props.placeholder && !tagElements ? props.placeholder : undefined}
                    onChange={onChangeInput}
                    onKeyDown={onKeyDownInput}
                    onPaste={onPasteInput}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                />
            </BoxContent>
            <BoxFooter
                theme={props.theme}
                error={isOver}
            >
                {`${tagElements ? tagElements.length : 0} / ${props.limitNum}`}
            </BoxFooter>
        </BoxWrapper>
    );
};

TextInputBox.defaultProps = {
    theme: 'light',
    color: '#3399ff',
    limitNum: 50,
    name: '',
    inputValues: [],
    placeholder: '',
    autoFocus: false,
    showErrorTooltip: false,
    checkInputError: () => false,
    onFocus: () => { /* */ },
    onBlur: () => { /* */ },
    onChangeInputValues: () => { /* */ },
};

export default TextInputBox;
