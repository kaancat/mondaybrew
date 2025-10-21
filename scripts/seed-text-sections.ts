/**
 * Seed script for text-image and text-only sections
 * Populates Sanity with placeholder content from the components
 */

import { createClient } from 'next-sanity';

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4ot323fc';
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!token) {
    console.error('Missing SANITY_AUTH_TOKEN (use: sanity exec scripts/seed-text-sections.ts --with-user-token)');
    process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2024-09-01', token, useCdn: false });

async function seedTextSections() {
    console.log('🌱 Starting to seed text sections...\n');

    try {
        // Get the homepage document
        const home = await client.fetch<{
            _id: string;
            sections?: Array<{ _type?: string; _key?: string } & Record<string, unknown>> | null;
        }>(
            `*[_type=="page" && isHome == true && locale == "da"][0]{ _id, sections }`,
        );

        if (!home?._id) {
            console.error('No homepage document found (isHome==true, locale==da)');
            process.exit(1);
        }

        console.log(`✅ Found homepage: ${home._id}\n`);

        // Upload image for text-image component
        console.log('📷 Uploading image...');
        const imageUrl = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=900&fit=crop';
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const imageAsset = await client.assets.upload('image', Buffer.from(buffer), {
            filename: 'office-coding.jpg',
            contentType: 'image/jpeg',
        });
        console.log('✅ Image uploaded:', imageAsset._id);

        // Add text-image section to homepage
        console.log('\n📝 Adding text-image section to homepage...');
        await client
            .patch(home._id)
            .setIfMissing({ sections: [] })
            .insert('after', 'sections[-1]', [
                {
                    _type: 'textImage',
                    eyebrow: 'OUR APPROACH',
                    title: 'Crafting digital experiences that drive results',
                    body: 'We believe in creating more than just websites and campaigns—we build comprehensive digital ecosystems that connect with your audience at every touchpoint. Our team combines strategic thinking with creative execution to deliver solutions that not only look exceptional but perform exceptionally. From initial concept to final deployment, we ensure every detail aligns with your business goals and exceeds user expectations. Our process is collaborative, transparent, and focused on sustainable growth that adapts to your evolving needs.',
                    image: {
                        _type: 'imageWithAlt',
                        alt: 'Team working on digital projects in modern office',
                        image: {
                            _type: 'image',
                            asset: {
                                _type: 'reference',
                                _ref: imageAsset._id,
                            },
                        },
                    },
                    imagePosition: 'left',
                    cta: {
                        _type: 'button',
                        label: 'Learn More',
                        href: '/om-os',
                        variant: 'default',
                    },
                },
            ])
            .commit();
        console.log('✅ Text-image section added');

        // Add text-only section to homepage
        console.log('\n📝 Adding text-only section to homepage...');
        await client
            .patch(home._id)
            .setIfMissing({ sections: [] })
            .insert('after', 'sections[-1]', [
                {
                    _type: 'textOnly',
                    eyebrow: 'OUR COMMITMENT',
                    title: 'Building lasting partnerships',
                    body: 'Quality-driven partnerships are at the heart of everything we do. We don\'t just deliver projects—we invest in long-term relationships built on trust, transparency, and mutual success. Our approach combines deep industry expertise with a genuine commitment to understanding your unique challenges and opportunities. Every engagement is an opportunity to exceed expectations and create lasting value for your business.',
                    cta: {
                        _type: 'button',
                        label: 'Get Started',
                        href: '/kontakt',
                        variant: 'default',
                    },
                    cta2: {
                        _type: 'button',
                        label: 'View Our Work',
                        href: '/cases',
                        variant: 'secondary',
                    },
                },
            ])
            .commit();
        console.log('✅ Text-only section added');

        console.log('\n✨ Seeding complete!');
        console.log('📋 Both sections have been added to the homepage');
        console.log('\n💡 Next steps:');
        console.log('   1. Go to Sanity Studio (http://localhost:3000/studio)');
        console.log('   2. View the homepage to see the new sections');
        console.log('   3. Publish the changes\n');

    } catch (error) {
        console.error('❌ Error seeding sections:', error);
        process.exit(1);
    }
}

seedTextSections();

