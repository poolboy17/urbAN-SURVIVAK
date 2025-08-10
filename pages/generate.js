
import Head from 'next/head';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIArticleGenerator from '../components/AIArticleGenerator';
import { getGlobalData } from '../utils/global-data';

export default function GeneratePage({ globalData }) {
  return (
    <Layout>
      <Head>
        <title>AI Article Generator - {globalData.siteName}</title>
        <meta name="description" content="Generate high-quality articles using AI technology" />
      </Head>
      
      <Header name={globalData.name} />
      
      <main className="container mx-auto px-4 py-8">
        <AIArticleGenerator />
      </main>
      
      <Footer copyrightText={globalData.footerText} />
    </Layout>
  );
}

export function getStaticProps() {
  const globalData = getGlobalData();
  return { props: { globalData } };
}
