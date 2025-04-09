
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "What is InternQuest?",
      answer: "InternQuest is a platform connecting students with internship opportunities at leading South African companies. We streamline the internship search and application process."
    },
    {
      question: "How do I apply for internships?",
      answer: "Create a student account, complete your profile, and browse available internships. When you find a suitable position, simply click the apply button and follow the application process."
    },
    {
      question: "Is it free for students?",
      answer: "Yes, InternQuest is completely free for students to use. You can create an account, browse internships, and submit applications at no cost."
    },
    {
      question: "How do companies post internships?",
      answer: "Companies can create an account, complete their profile, and post internship opportunities through their dashboard. Our platform makes it easy to manage applications and communicate with candidates."
    },
    {
      question: "What types of internships are available?",
      answer: "We offer a wide range of internships across various industries including technology, finance, marketing, engineering, and more. Both remote and on-site opportunities are available."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-gray-500">
            Find answers to common questions about InternQuest
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
