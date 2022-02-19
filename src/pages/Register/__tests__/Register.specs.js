import React from 'react';
import Register from "../Register";
import { cleanup, render, screen } from "@testing-library/react";
import { registerUser, signUp, validateFieldsEmpty, validatePasswordsMatching } from '../Register.Utilities';
import { fn } from 'moment';

jest.mock('../Register.utilities')

const mockFormFields = {
    username: 'mockUsername',
    password: 'mockPassword',
    confirmPassword: 'mockPassword',

    resetMockFormFields() {
        mockFormFields.username = 'mockUsername'
        mockFormFields.password = 'mockPassword'
        mockFormFields.confirmPassword = 'mockPassword'
    },

    setEmptyFormFields() {
        mockFormFields.username = ''
        mockFormFields.password = ''
        mockFormFields.confirmPassword = ''
    }
}

const mockedToast = {
    message: 'Mocked toast message',
    duration: 0,
}

describe('Register function', () => {

    afterEach(cleanup)

    test('Component renders without crashing', async () => {
        const { registerPage } = render(<Register />)
        await screen.findByTestId('btn-register')
    })

    describe('When a form field is empty', () => {
        
        beforeEach(() => {
            mockFormFields.setEmptyFormFields()
        }) 

        describe('When user name field is empty', () => {
            const mockRegisterUser = jest.fn(() => Promise.resolve())

            test('Should return confirmation of empty fields', () => {
                expect(validateFieldsEmpty(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)).toBe(true)
            })

            test('Should not send call to register user to firebase', () => {
                signUp(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)

                expect(mockRegisterUser).not.toHaveBeenCalled()
            })
        })

        describe('When password field is empty', () => {
            const mockRegisterUser = jest.fn(() => Promise.resolve())

            test('Should return confirmation of empty fields', () => {
                expect(validateFieldsEmpty(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)).toBe(true)
            })

            test('Should not send call to register user to firebase', () => {
                signUp(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)

                expect(mockRegisterUser).not.toHaveBeenCalled()
            })
        })


        describe('When confirmation password field is empty', () => {
            const mockRegisterUser = jest.fn(() => Promise.resolve())

            test('Should return confirmation of empty fields', () => {
                expect(validateFieldsEmpty(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)).toBe(true)
            })

            test('Should not send call to register user to firebase', () => {
                signUp(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)

                expect(mockRegisterUser).not.toHaveBeenCalled()
            })
        })
    })


    describe('When fields have data', () => {

        beforeEach(() => {
            mockFormFields.resetMockFormFields()
        })

        describe('When password and confirmation password do not match', () => {
            const mockRegisterUser = jest.fn(() => Promise.resolve())

            test('Should return confirmation of missmatching passwords', () => {
                mockFormFields.password = 'password'
                mockFormFields.confirmPassword = 'notthesamepassword'
                expect(validatePasswordsMatching(mockFormFields.password, mockFormFields.confirmPassword)).toBe(false)
            })

            test('Should not send call to register user to firebase', () => {
                signUp(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)

                expect(mockRegisterUser).not.toHaveBeenCalled()
            })
        })

        describe('When username field has data', () => {

            test('Should return confirmation of matching passwords', () => {
                expect(validateFieldsEmpty(mockFormFields.password, mockFormFields.confirmPassword)).toBe(false)
            })
        })

        describe('When password and confirmation password match', () => {

            test('Should return confirmation of matching passwords', () => {
                expect(validatePasswordsMatching(mockFormFields.password, mockFormFields.confirmPassword)).toBe(true)
            })
        })

    
        describe('When userName field is filled and passwords match', () => {
            
            test('Should send call to register user to firebase', () => {
                
                expect(validatePasswordsMatching(mockFormFields.password, mockFormFields.confirmPassword)).toBe(true)
                expect(validateFieldsEmpty(mockFormFields.password, mockFormFields.confirmPassword)).toBe(false)
            })
        })

    })
})