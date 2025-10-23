import { useCallback } from 'react';
import { set, unset } from 'sanity';
import { Stack, Select, Text } from '@sanity/ui';
import { StringInputProps, useFormValue } from 'sanity';

/**
 * Custom input component for breadcrumb section selection
 * 
 * Shows a dropdown of all content blocks on the current page (except Hero Page).
 * When a section is selected, stores its _key so it can be linked to on the frontend.
 */
export function BreadcrumbSectionSelector(props: StringInputProps) {
  const { onChange, value } = props;
  
  // Get all sections from the current page document
  const sections = useFormValue(['sections']) as Array<{
    _key?: string;
    _type?: string;
    title?: string;
    heading?: string;
    eyebrow?: string;
  }> | undefined;

  // Get readable section type names
  const getSectionTypeName = (type: string): string => {
    const typeMap: Record<string, string> = {
      textImage: 'Text + Image',
      textOnly: 'Text Only',
      heroPage: 'Hero Page',
      servicesSplit: 'Services Split',
      caseStudyCarousel: 'Case Study Carousel',
      clientsSection: 'Clients',
      testimonialsMarquee: 'Testimonials',
      aboutSection: 'About',
    };
    return typeMap[type] || type;
  };

  // Filter out Hero Page sections (we don't want to link to the hero itself)
  // and map to a clean format
  const availableSections = (sections || [])
    .filter((section) => section?._type !== 'heroPage' && section?._key)
    .map((section, index) => ({
      key: section._key || '',
      type: section._type || 'unknown',
      typeName: getSectionTypeName(section._type || 'unknown'),
      title: section.title || section.heading || section.eyebrow || `Section ${index + 1}`,
    }));

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      onChange(selectedValue ? set(selectedValue) : unset());
    },
    [onChange]
  );

  // Find the selected section to show its details
  const selectedSection = availableSections.find((s) => s.key === value);

  return (
    <Stack space={3}>
      <Select
        value={value || ''}
        onChange={handleChange}
        fontSize={2}
        padding={3}
        space={3}
      >
        <option value="">Select a content block...</option>
        {availableSections.length === 0 && (
          <option value="" disabled>
            No content blocks found on this page
          </option>
        )}
        {availableSections.map((section) => (
          <option key={section.key} value={section.key}>
            {section.title} ({section.typeName})
          </option>
        ))}
      </Select>
      
      {availableSections.length === 0 && (
        <Text size={1} muted>
          💡 Add content blocks below (Text+Image, Text Only, etc.) first. Then come back here to select them.
        </Text>
      )}
      
      {selectedSection && (
        <Text size={1} muted>
          Will scroll to: <strong>{selectedSection.title}</strong> ({selectedSection.typeName})
        </Text>
      )}
    </Stack>
  );
}

