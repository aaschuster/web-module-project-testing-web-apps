import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />)
});

test('renders the contact form header', () => {
    render(<ContactForm />)
    const header = screen.getByText(/contact form/i);

    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);

    const fNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(fNameInput, "1234");
    
    const errs = await screen.findAllByTestId("error");
    expect(errs).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);

    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);

    await waitFor(() => {
        const errs = screen.queryAllByTestId("error");
        expect(errs).toHaveLength(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);

    const fNameInput = screen.getByLabelText(/first name*/i);
    const lNameInput = screen.getByLabelText(/last name*/i);
    const submitBtn = screen.getByRole("button");
    userEvent.type(fNameInput, "George");
    userEvent.type(lNameInput, "Lopez");
    userEvent.click(submitBtn);
    
    const errs = await screen.findAllByTestId("error");
    expect(errs).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email*/i);

    userEvent.type(emailInput, "totallyvalidemail&gmail:com");
    
    const emailErr = await screen.findByText(/email must be a valid email address./i);
    expect(emailErr).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);

    const submitBtn = screen.getByRole("button");

    userEvent.click(submitBtn);

    const lNameErr = await screen.findByText(/lastName is a required field/i);
    expect(lNameErr).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const fNameInput = screen.getByLabelText(/first name*/i);
    const lNameInput = screen.getByLabelText(/last name*/i);
    const emailInput = screen.getByLabelText(/email*/i);
    const submitBtn = screen.getByRole("button");

    userEvent.type(fNameInput, "Ronald");
    userEvent.type(lNameInput, "Toomer");
    userEvent.type(emailInput, "rtoomer@arrowdynamics.com");
    userEvent.click(submitBtn);

    await waitFor(() => {
        const fNameDisplay = screen.queryByText("Ronald");
        const lNameDisplay = screen.queryByText("Toomer");
        const emailDisplay = screen.queryByText(/rtoomer@arrowdynamics.com/i);
        const messageDisplay = screen.queryByTestId("messageDisplay");

        expect(fNameDisplay).toBeInTheDocument();
        expect(lNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);

    const fNameInput = screen.getByLabelText(/first name*/i);
    const lNameInput = screen.getByLabelText(/last name*/i);
    const emailInput = screen.getByLabelText(/email*/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitBtn = screen.getByRole("button");

    userEvent.type(fNameInput, "Ronald");
    userEvent.type(lNameInput, "Toomer");
    userEvent.type(emailInput, "rtoomer@arrowdynamics.com");
    userEvent.type(messageInput, "Do you even know what year it is?");
    userEvent.click(submitBtn);

    await waitFor(() => {
        const fNameDisplay = screen.queryByText("Ronald");
        const lNameDisplay = screen.queryByText("Toomer");
        const emailDisplay = screen.queryByText(/rtoomer@arrowdynamics.com/i);
        const messageDisplay = screen.queryByTestId("messageDisplay");

        expect(fNameDisplay).toBeInTheDocument();
        expect(lNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    });
});
