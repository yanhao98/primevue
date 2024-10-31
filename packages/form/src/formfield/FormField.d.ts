/**
 *
 * FormField is a helper component that provides validation and tracking for form fields.
 * It is a helper component for the Form component.
 *
 * [Live Demo](https://www.primevue.org/form/)
 *
 * @module formfield
 * @todo Add more documentation
 */
import type { DefineComponent, DesignToken, EmitFn, PassThrough } from '@primevue/core';
import type { ComponentHooks } from '@primevue/core/basecomponent';
import { VNode } from 'vue';

/**
 * From primevue/passthrough/index.d.ts
 */
export declare type PassThroughMergePropsType = ((...args: any) => object | undefined) | boolean | undefined;

export interface PassThroughOptions {
    mergeSections?: boolean | undefined;
    mergeProps?: PassThroughMergePropsType;
}

export declare type FormFieldPassThroughOptionType = FormFieldPassThroughAttributes | ((options: FormFieldPassThroughMethodOptions) => FormFieldPassThroughAttributes | string) | string | null | undefined;

/**
 * Custom passthrough(pt) option method.
 */
export interface FormFieldPassThroughMethodOptions {
    /**
     * Defines instance.
     */
    instance: any;
    /**
     * Defines valid properties.
     */
    props: FormFieldProps;
    /**
     * Defines valid attributes.
     */
    attrs: any;
    /**
     * Defines parent options.
     */
    parent: any;
    /**
     * Defines passthrough(pt) options in global config.
     */
    global: object | undefined;
}

/**
 * Custom passthrough(pt) options.
 * @see {@link FormFieldProps.pt}
 */
export interface FormFieldPassThroughOptions {
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: FormFieldPassThroughOptionType;
    /**
     * Used to manage all lifecycle hooks.
     * @see {@link BaseComponent.ComponentHooks}
     */
    hooks?: ComponentHooks;
}

/**
 * Custom passthrough attributes for each DOM elements
 */
export interface FormFieldPassThroughAttributes {
    [key: string]: any;
}

/**
 * Resolver options for Form component.
 */
export interface FormFieldResolverOptions {
    /**
     * The values of the form fields.
     */
    values: Record<string, any>;
    /**
     * The names of the form fields.
     */
    names: string[] | undefined;
}

/**
 * Submit events
 */
export interface FormFieldSubmitEvent {
    /**
     * The original DOM event.
     */
    originalEvent: Event;
    /**
     * The form values.
     */
    values: Record<string, any>;
    /**
     * The form state.
     */
    states: Record<string, FormFieldState>;
    /**
     * Whether the form is valid.
     */
    valid: boolean;
    /**
     * The form errors.
     */
    errors: any[];
    /**
     * Resets the form.
     */
    reset: () => void;
}

/**
 * The state of a form field.
 */
export interface FormFieldState {
    /**
     * The value of the form field.
     */
    value: any;
    /**
     * Whether the form field has been touched.
     * @defaultValue false
     */
    touched: boolean;
    /**
     * Whether the form field has been modified.
     * @defaultValue false
     */
    dirty: boolean;
    /**
     * Whether the form field has not been modified.
     * @defaultValue true
     */
    pristine: boolean;
    /**
     * Whether the form field is valid.
     * @defaultValue true
     */
    valid: boolean;
    /**
     * Whether the form field is invalid.
     * @defaultValue false
     */
    invalid: boolean;
    /**
     * The first error message of the form field.
     */
    error: any;
    /**
     * All error messages of the form field.
     * @defaultValue []
     */
    errors: any[];
}

/**
 * Defines valid properties in Form component.
 */
export interface FormFieldProps {
    /**
     * A function that resolves validation logic.
     * @param {FormResolverOptions} e - Resolver options
     */
    resolver?: (e: FormFieldResolverOptions) => Promise<Record<string, any>> | Record<string, any> | undefined;
    /**
     * The initial values for the form fields.
     */
    initialValues?: Record<string, any> | undefined;
    /**
     * Whether to validate the form fields when the values change.
     * @defaultValue true
     */
    validateOnValueUpdate?: boolean | string[] | undefined;
    /**
     * Whether to validate the form fields when they lose focus (on blur).
     * @defaultValue false
     */
    validateOnBlur?: boolean | string[] | undefined;
    /**
     * Whether to validate the form fields immediately after the form is mounted.
     * @defaultValue false
     */
    validateOnMount?: boolean | string[] | undefined;
    /**
     * Whether to validate the form fields when the form is submitted.
     * @defaultValue true
     */
    validateOnSubmit?: boolean | string[] | undefined;
    /**
     * It generates scoped CSS variables using design tokens for the component.
     */
    dt?: DesignToken<any>;
    /**
     * Used to pass attributes to DOM elements inside the component.
     * @type {FormPassThroughOptions}
     */
    pt?: PassThrough<FormFieldPassThroughOptions>;
    /**
     * Used to configure passthrough(pt) options of the component.
     * @type {PassThroughOptions}
     */
    ptOptions?: PassThroughOptions;
    /**
     * When enabled, it removes component related styles in the core.
     * @defaultValue false
     */
    unstyled?: boolean;
}

/**
 * Defines valid slots in Form component.
 */
export interface FormSlots {
    /**
     * Default content slot.
     * @param {Object} scope - default slot's params.
     */
    default: (scope: {
        /**
         * Registers a form field for validation and tracking.
         * @param field - The name of the form field to register.
         * @param options - Configuration options for the field, such as validation rules.
         * @returns - Returns an object or value representing the registered field.
         */
        register: (field: string, options: any) => any;
        /**
         * Resets the entire form state, clearing values and validation statuses.
         */
        reset: () => void;
        /**
         * Indicates whether the form is valid, returning `true` if all fields pass validation.
         */
        valid: boolean;
        /**
         * Stores the state of each form field, with the field name as the key and its state as the value.
         */
        states: Record<string, FormFieldState>;
    }) => VNode[];
}

/**
 * Defines valid emits in Form component.
 */
export interface FormEmitsOptions {
    /**
     * Emitted when the form is submitted.
     * @param {Event} event - Original DOM event.
     */
    submit: (event: Event) => void;
}

export declare type FormEmits = EmitFn<FormEmitsOptions>;

/**
 * **PrimeVue - Form**
 *
 * _Form provides validation functionality and manages form state._
 *
 * [Live Demo](https://www.primevue.org/form/)
 * --- ---
 * ![PrimeVue](https://primefaces.org/cdn/primevue/images/logo-100.png)
 *
 * @group Component
 *
 */
declare const FormField: DefineComponent<FormFieldProps, FormSlots, FormEmits>;

declare module 'vue' {
    export interface GlobalComponents {
        FormField: DefineComponent<FormFieldProps, FormSlots, FormEmits>;
    }
}

export default FormField;