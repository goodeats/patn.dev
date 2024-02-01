import { Icon } from '../ui/icon'
import { floatingToolbarClassName } from '.'

const FormContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className="inset-0 flex-1">{children}</div>
}

const formDefaultClassName =
	'flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-5'

const FormFieldsContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className="flex flex-col gap-1">{children}</div>
}

const FormActionsContainer = ({ children }: { children: React.ReactNode }) => {
	return <div className={floatingToolbarClassName}>{children}</div>
}

const FormDeleteIcon = () => {
	return (
		<Icon name="trash" className="scale-125 max-md:scale-150">
			<span className="max-md:hidden">Delete</span>
		</Icon>
	)
}

const FormDownloadIcon = () => {
	return (
		<Icon name="download" className="scale-125 max-md:scale-150">
			<span className="max-md:hidden">Download</span>
		</Icon>
	)
}

const formDeleteButtonDefaultClassName =
	'w-full max-md:aspect-square max-md:px-0'

export {
	FormContainer,
	FormFieldsContainer,
	FormActionsContainer,
	FormDeleteIcon,
	FormDownloadIcon,
	formDefaultClassName,
	formDeleteButtonDefaultClassName,
}
