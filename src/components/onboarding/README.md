# Vendor Onboarding System

A comprehensive, multi-step onboarding experience for vendors to sign up and set up their profiles on the platform.

## Overview

The vendor onboarding system consists of 7 sequential steps that guide vendors through the complete account setup process:

1. **Account Creation** - Basic user information and credentials
2. **Business Profile** - Business details and description
3. **Service Categories** - Selection of services offered
4. **Location & Availability** - Service areas and scheduling
5. **Documentation** - Required document uploads
6. **Pricing & Packages** - Service pricing structure
7. **Review & Submit** - Final review and application submission

## Architecture

### Core Components

- **`OnboardingContainer`** - Main container that manages the multi-step flow
- **Step Components** - Individual components for each onboarding step
- **Progress Tracking** - Visual progress indicators and step navigation
- **Data Management** - Centralized state management across all steps

### Key Features

- **Modular Design** - Each step is a separate, reusable component
- **Builder.io Integration** - All components are registered for visual editing
- **Responsive UI** - Mobile-first design with Tailwind CSS
- **Form Validation** - Client-side validation with error handling
- **Progress Persistence** - Data is maintained between step navigation
- **Flexible Navigation** - Users can move between completed steps

## Component Structure

```
src/components/onboarding/
├── OnboardingContainer.tsx          # Main container component
├── index.ts                         # Export file
├── README.md                        # This documentation
└── steps/                          # Individual step components
    ├── AccountCreationStep.tsx      # Step 1: Account creation
    ├── BusinessProfileStep.tsx      # Step 2: Business profile
    ├── ServiceCategoriesStep.tsx    # Step 3: Service selection
    ├── LocationAvailabilityStep.tsx # Step 4: Location & availability
    ├── DocumentationStep.tsx        # Step 5: Document uploads
    ├── PricingPackagesStep.tsx      # Step 6: Pricing setup
    └── ReviewSubmitStep.tsx         # Step 7: Review & submit
```

## Usage

### Basic Implementation

```tsx
import { OnboardingContainer } from '@/components/onboarding'

const onboardingSteps = [
  {
    id: 'account-creation',
    title: 'Account Creation',
    description: 'Create your vendor account',
    component: AccountCreationStep,
    isComplete: false
  },
  // ... more steps
]

export default function VendorOnboarding() {
  return (
    <OnboardingContainer
      title="Complete Your Vendor Profile"
      subtitle="Join our platform and start offering your services"
      steps={onboardingSteps}
      showProgressBar={true}
      allowStepNavigation={true}
    />
  )
}
```

### Customizing Steps

Each step component accepts standard props and can be customized:

```tsx
<AccountCreationStep
  stepData={existingData}
  onComplete={handleStepComplete}
  onNext={goToNextStep}
  onPrevious={goToPreviousStep}
  isFirstStep={true}
  isLastStep={false}
  allData={allOnboardingData}
/>
```

## Builder.io Integration

All components are automatically registered with Builder.io for visual editing:

- **Component Registration** - Each component is registered with inputs and styling options
- **Visual Editing** - Non-technical users can customize layouts and content
- **Reusability** - Components can be used in other parts of the application
- **Customization** - Colors, text, and layout can be modified through the Builder.io interface

### Available Builder.io Components

1. **Onboarding Container** - Main flow container with progress tracking
2. **Account Creation Step** - User registration form
3. **Business Profile Step** - Business information form
4. **Service Categories Step** - Service selection interface
5. **Location & Availability Step** - Geographic and scheduling setup
6. **Documentation Step** - File upload interface
7. **Pricing & Packages Step** - Pricing structure setup
8. **Review & Submit Step** - Final review and submission

## Data Flow

### Step Completion

1. User fills out step form
2. Form validation occurs
3. `onComplete` callback is triggered with step data
4. Data is stored in the container's state
5. User is automatically moved to the next step

### Data Persistence

- All form data is maintained in the `OnboardingContainer` state
- Users can navigate between completed steps without losing data
- Data is only submitted when the final step is completed

### Validation

- Each step includes client-side validation
- Required fields are clearly marked
- Error messages are displayed inline
- Users cannot proceed without completing required fields

## Styling & Theming

### Tailwind CSS Classes

The system uses Tailwind CSS for consistent styling:
- Responsive grid layouts
- Consistent spacing and typography
- Interactive states (hover, focus, disabled)
- Color schemes that can be customized

### Customization Options

- **Colors** - Background, text, and accent colors
- **Layout** - Container width, padding, and margins
- **Typography** - Font sizes, weights, and families
- **Components** - Individual step styling and behavior

## Accessibility Features

- **Keyboard Navigation** - All interactive elements are keyboard accessible
- **Screen Reader Support** - Proper ARIA labels and descriptions
- **Focus Management** - Clear focus indicators and logical tab order
- **Error Handling** - Accessible error messages and validation feedback

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement for older browsers

## Performance Considerations

- **Lazy Loading** - Step components are loaded as needed
- **State Management** - Efficient state updates and re-renders
- **Form Optimization** - Debounced input handling and validation
- **Bundle Size** - Components are tree-shakeable and modular

## Future Enhancements

- **Multi-language Support** - Internationalization (i18n)
- **Advanced Validation** - Server-side validation and real-time feedback
- **Analytics Integration** - Step completion tracking and user behavior analysis
- **A/B Testing** - Different onboarding flows for optimization
- **Offline Support** - Progressive Web App capabilities
- **Integration APIs** - Third-party service integrations

## Troubleshooting

### Common Issues

1. **Step Navigation Not Working** - Ensure all step components are properly imported
2. **Form Data Not Persisting** - Check that `onComplete` callbacks are properly implemented
3. **Builder.io Components Not Showing** - Verify component registration and API key configuration
4. **Styling Issues** - Ensure Tailwind CSS is properly configured

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
NEXT_PUBLIC_DEBUG_ONBOARDING=true
```

## Contributing

When adding new steps or modifying existing ones:

1. Follow the established component structure
2. Include proper TypeScript interfaces
3. Register components with Builder.io
4. Add comprehensive validation
5. Update this documentation
6. Include accessibility features
7. Test across different devices and browsers

## License

This onboarding system is part of the main application and follows the same licensing terms.