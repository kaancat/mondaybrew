import { useCallback } from 'react';
import { set, unset } from 'sanity';
import { Stack, Select, Text } from '@sanity/ui';
import { StringInputProps, useFormValue } from 'sanity';

/**
 * Custom input component for breadcrumb section selection
 * 
 * Shows a dropdown of all content sections on the current page that have Section IDs.
 * When a section is selected, automatically fills in the anchor field.
 */
export function BreadcrumbSectionSelector(props: StringInputProps) {
  const { onChange, value } = props;
  
  // Get all sections from the current page document
  const sections = useFormValue(['sections']) as Array<{
    _key?: string;
    _type?: string;
    title?: string;
    heading?: string;
    sectionId?: { current?: string };
  }> | undefined;

  // Filter sections that have a sectionId
  const availableSections = (sections || [])
    .filter((section) => section?.sectionId?.current)
    .map((section) => ({
      key: section._key || '',
      type: section._type || 'unknown',
      title: section.title || section.heading || 'Untitled section',
      sectionId: section.sectionId?.current || '',
    }));

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      onChange(selectedValue ? set(selectedValue) : unset());
    },
    [onChange]
  );

  return (
    <Stack space={3}>
      <Select
        value={value || ''}
        onChange={handleChange}
        fontSize={2}
        padding={3}
        space={3}
      >
        <option value="">Select a content section...</option>
        {availableSections.length === 0 && (
          <option value="" disabled>
            No sections with Section IDs found
          </option>
        )}
        {availableSections.map((section) => (
          <option key={section.key} value={section.sectionId}>
            {section.title} (ID: {section.sectionId})
          </option>
        ))}
      </Select>
      
      {availableSections.length === 0 && (
        <Text size={1} muted>
          💡 Add content sections below (Text+Image, Text Only, etc.) and generate their Section IDs first.
          Then come back here to select them.
        </Text>
      )}
      
      {value && (
        <Text size={1} muted>
          Selected: <code>#{value}</code>
        </Text>
      )}
    </Stack>
  );
}

