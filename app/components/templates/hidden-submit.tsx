// This hidden submit button is here to ensure that when the user hits
// "enter" on an input field, the primary form function is submitted
// rather than the first button in the form (which is delete/add image).
export const HiddenSubmitButton = () => {
	return <button type="submit" className="hidden" />
}
