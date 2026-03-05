import React, { useState } from 'react';
import { Play, Pause, AlertCircle, CheckCircle, Database, Zap, Users, Brain, Clock, MessageSquare } from 'lucide-react';

export default function AgenticRAGLowLevelDesign() {
  const [activeTab, setActiveTab] = useState('architecture');
  const [expandedComponent, setExpandedComponent] = useState('agent');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  // Simulation data
  const simulationSteps = [
    {
      step: 1,
      component: 'User Input',
      action: 'User: "What are the latest financing trends for AI startups in 2024?"',
      status: 'input',
      details: 'Query enters memory buffer'
    },
    {
      step: 2,
      component: 'Agent (LLM Loop)',
      action: 'Agent Thought: "Need recent data on AI startup funding. Should search financial databases."',
      status: 'processing',
      details: 'Agent analyzes query, decides action'
    },
    {
      step: 3,
      component: 'Tool: search_documents',
      action: 'Tool Call: search_documents(query="AI startup financing 2024", max_results=5)',
      status: 'api_call',
      details: 'MCP Server → Vector DB Search'
    },
    {
      step: 4,
      component: 'Vector DB (Pinecone)',
      action: 'Retrieve: 5 documents about AI funding trends, startup valuations, investment patterns',
      status: 'processing',
      details: 'Similarity search using embeddings'
    },
    {
      step: 5,
      component: 'Agent Observation',
      action: 'Agent observes: Got 5 documents. Missing: Specific funding sources, investor details.',
      status: 'processing',
      details: 'Agent evaluates retrieved information'
    },
    {
      step: 6,
      component: 'Tool: query_api',
      action: 'Tool Call: query_api(endpoint="/api/investors", filter="AI startups, 2024")',
      status: 'api_call',
      details: 'MCP Server → External API'
    },
    {
      step: 7,
      component: 'External API',
      action: 'Response: Latest investor data, funding rounds, market trends',
      status: 'processing',
      details: 'Real-time data from API'
    },
    {
      step: 8,
      component: 'Agent Decision',
      action: 'Agent Thought: "Have sufficient data. Ready to generate answer."',
      status: 'processing',
      details: 'Check stopping criteria'
    },
    {
      step: 9,
      component: 'Memory Update',
      action: 'Store in conversation memory: Query, retrieved docs, API responses, reasoning',
      status: 'memory',
      details: 'Update short-term & long-term memory'
    },
    {
      step: 10,
      component: 'LLM Generation',
      action: 'Generate: Comprehensive answer on AI startup financing trends with sources',
      status: 'processing',
      details: 'Final response generation'
    },
    {
      step: 11,
      component: 'Evaluation',
      action: 'Evaluate: Relevance score 0.92, Factuality check: PASS, Sources found: 5',
      status: 'evaluation',
      details: 'Automatic quality checks'
    },
    {
      step: 12,
      component: 'Human in Loop',
      action: 'User feedback: "Helpful but missing specific Series B data. Can you refine?"',
      status: 'human_loop',
      details: 'User provides feedback'
    }
  ];

  const components = {
    agent: {
      name: 'Agent Loop (ReAct)',
      description: 'Core decision-making engine',
      responsibilities: [
        'Parse user query',
        'Decide which tools to call',
        'Evaluate observations',
        'Check stopping criteria',
        'Iterate until sufficient info'
      ],
      implementation: {
        language: 'Python/TypeScript',
        framework: 'LangChain / Custom implementation',
        loop: [
          'Thought: Agent reasons about next action',
          'Action: Agent calls tool with parameters',
          'Observation: Tool returns result',
          'Repeat or Stop based on confidence'
        ],
        pseudocode: `
while not done and iterations < MAX:
  thought = llm.generate(
    prompt=f"Query: {query}\\nContext: {context}\\nTools: {tools}"
  )
  
  action = parse_tool_call(thought)
  if action == "STOP":
    break
    
  observation = execute_tool(action)
  context.append(observation)
  iterations += 1

final_answer = llm.generate(prompt=f"Answer based on: {context}")
        `
      }
    },
    vectordb: {
      name: 'Vector Database (Pinecone/Weaviate)',
      description: 'Semantic search storage',
      responsibilities: [
        'Store document embeddings',
        'Fast semantic similarity search',
        'Metadata filtering',
        'Scalable to millions of documents'
      ],
      implementation: {
        choice: 'Pinecone (recommended for simplicity)',
        alternatives: ['Weaviate (self-hosted)', 'Milvus (high performance)', 'Qdrant'],
        schema: {
          index_name: 'documents',
          vector_dim: 1536,
          metric: 'cosine',
          metadata_fields: [
            'source_doc (string)',
            'chunk_id (string)',
            'timestamp (datetime)',
            'document_type (string)',
            'section (string)',
            'relevance_score (float)'
          ]
        },
        operations: {
          upsert: 'Add/update embeddings with metadata',
          query: 'Search by vector + metadata filter',
          delete: 'Remove outdated documents'
        },
        pseudocode: `
# Indexing
def index_documents(docs):
  for chunk in chunks(docs):
    embedding = embed_model.encode(chunk.text)
    vector_db.upsert(
      id=chunk.id,
      values=embedding,
      metadata={
        'source': chunk.source,
        'timestamp': chunk.date,
        'section': chunk.section
      }
    )

# Retrieval
def retrieve(query, top_k=5):
  query_embedding = embed_model.encode(query)
  results = vector_db.query(
    vector=query_embedding,
    top_k=top_k,
    filter={'timestamp': {'$gte': '2024-01-01'}}
  )
  return results
        `
      }
    },
    mcp: {
      name: 'Model Context Protocol (MCP)',
      description: 'Tool interface standard',
      responsibilities: [
        'Define tool schemas',
        'Execute tool calls',
        'Handle tool responses',
        'Error handling'
      ],
      implementation: {
        architecture: 'Client-Server',
        client: 'Agent (LLM wrapper)',
        servers: ['Vector DB Server', 'API Gateway Server', 'Database Server'],
        tools: [
          {
            name: 'search_documents',
            params: { query: 'string', top_k: 'int', filters: 'dict' },
            returns: 'List[Document]'
          },
          {
            name: 'query_api',
            params: { endpoint: 'string', method: 'string', data: 'dict' },
            returns: 'JSON'
          },
          {
            name: 'query_database',
            params: { sql: 'string', params: 'dict' },
            returns: 'List[Row]'
          },
          {
            name: 'fact_check',
            params: { claim: 'string', context: 'List[string]' },
            returns: 'boolean'
          }
        ],
        pseudocode: `
class MCPServer:
  def register_tool(self, tool_def):
    self.tools[tool_def.name] = tool_def
    
  def execute(self, tool_name, args):
    tool = self.tools[tool_name]
    validate_args(args, tool.schema)
    try:
      result = tool.handler(**args)
      return {'success': True, 'result': result}
    except Exception as e:
      return {'success': False, 'error': str(e)}

class AgentClient:
  def call_tool(self, tool_name, args):
    response = mcp_server.execute(tool_name, args)
    if response['success']:
      self.memory.add('observation', response['result'])
    else:
      self.memory.add('error', response['error'])
        `
      }
    },
    memory: {
      name: 'Memory System',
      description: 'Conversation & context management',
      responsibilities: [
        'Short-term: Current conversation',
        'Long-term: Historical context',
        'Tool cache: Previous results',
        'Evaluation results'
      ],
      implementation: {
        layers: [
          {
            name: 'Immediate Context Buffer',
            storage: 'In-memory (Python list)',
            ttl: 'Session duration',
            contents: ['Current query', 'Retrieved docs', 'Tool responses', 'Agent thoughts']
          },
          {
            name: 'Conversation History',
            storage: 'Redis or PostgreSQL',
            ttl: '30 days',
            contents: ['User queries', 'Agent responses', 'User feedback']
          },
          {
            name: 'Tool Result Cache',
            storage: 'Redis',
            ttl: '1 hour',
            contents: ['Previous search results', 'API responses', 'Query results']
          }
        ],
        pseudocode: `
class Memory:
  def __init__(self):
    self.context_buffer = []  # Current conversation
    self.redis = Redis()      # Cache
    self.db = PostgreSQL()    # Long-term
    
  def add(self, role, content, metadata=None):
    # Add to immediate buffer
    self.context_buffer.append({
      'role': role,  # 'user', 'agent', 'tool', 'evaluation'
      'content': content,
      'timestamp': datetime.now(),
      'metadata': metadata
    })
    
    # If conversation growing too large, summarize
    if len(self.context_buffer) > 50:
      self.summarize_and_archive()
  
  def get_context(self, limit_tokens=2000):
    # Return most relevant context for next LLM call
    relevant = self.context_buffer[-20:]  # Last 20 items
    tokens = count_tokens(relevant)
    
    # Prioritize: Recent > Evaluation > Tool results > Thoughts
    return rank_by_relevance(relevant, tokens)
    
  def cache_tool_result(self, tool_name, args, result):
    cache_key = f"{tool_name}:{hash(str(args))}"
    self.redis.set(cache_key, result, ex=3600)  # 1 hour TTL
    
  def get_cached_result(self, tool_name, args):
    cache_key = f"{tool_name}:{hash(str(args))}"
    return self.redis.get(cache_key)
        `
      }
    },
    evaluation: {
      name: 'Evaluation Engine',
      description: 'Quality assessment system',
      responsibilities: [
        'Measure retrieval quality',
        'Measure answer quality',
        'Detect hallucinations',
        'Compute confidence scores',
        'Trigger human review'
      ],
      implementation: {
        metrics: [
          {
            name: 'Relevance Score',
            method: 'Semantic similarity between query and retrieved docs',
            threshold: 0.7,
            implementation: 'cosine(query_embedding, avg(doc_embeddings))'
          },
          {
            name: 'Source Quality',
            method: 'Check if answer claims have sources in retrieved docs',
            threshold: 0.95,
            implementation: 'NLI model or fact_check tool'
          },
          {
            name: 'Hallucination Rate',
            method: 'Check claims not in sources',
            threshold: 0.05,
            implementation: 'NLI(claim, source_text)'
          },
          {
            name: 'Confidence Score',
            method: 'Agent explicitly states confidence',
            threshold: 0.6,
            implementation: 'Extract from agent reasoning'
          },
          {
            name: 'Tool Success Rate',
            method: 'Percentage of tool calls successful',
            threshold: 0.9,
            implementation: 'Count successful / total calls'
          }
        ],
        pseudocode: `
class Evaluator:
  def evaluate_response(self, query, retrieved_docs, generated_answer, agent_thoughts):
    scores = {}
    
    # Relevance: Are retrieved docs relevant to query?
    query_emb = embed(query)
    doc_embs = [embed(doc) for doc in retrieved_docs]
    scores['relevance'] = max([cosine_sim(query_emb, de) for de in doc_embs])
    
    # Factuality: Are claims in answer supported by sources?
    claims = extract_claims(generated_answer)
    source_text = '\\n'.join(retrieved_docs)
    factuality_scores = [
      nli_model(claim, source_text)  # Returns 0-1
      for claim in claims
    ]
    scores['factuality'] = mean(factuality_scores)
    
    # Hallucination rate
    hallucinations = [
      claim for claim in claims 
      if nli_model(claim, source_text) < 0.3
    ]
    scores['hallucination_rate'] = len(hallucinations) / len(claims)
    
    # Confidence (from agent)
    scores['confidence'] = extract_confidence(agent_thoughts)
    
    # Determine if human review needed
    if scores['hallucination_rate'] > 0.05:
      return {'pass': False, 'reason': 'High hallucination', 'review_needed': True}
    if scores['relevance'] < 0.7:
      return {'pass': False, 'reason': 'Low relevance', 'review_needed': True}
    if scores['confidence'] < 0.6:
      return {'pass': False, 'reason': 'Low confidence', 'review_needed': True}
      
    return {'pass': True, 'scores': scores, 'review_needed': False}
        `
      }
    },
    humanloop: {
      name: 'Human-in-the-Loop',
      description: 'User feedback & refinement',
      responsibilities: [
        'Accept user feedback on responses',
        'Trigger agent re-runs with feedback',
        'Collect training data',
        'Manage escalations'
      ],
      implementation: {
        flows: [
          {
            name: 'Feedback Loop',
            trigger: 'User rates response or provides feedback',
            action: [
              '1. Store feedback in memory',
              '2. If negative: Trigger agent re-run with feedback prompt',
              '3. If positive: Cache as successful example'
            ]
          },
          {
            name: 'Refinement Loop',
            trigger: 'User says "Can you improve?" or rates <0.7',
            action: [
              '1. Modify query with user feedback',
              '2. Run agent again with updated context',
              '3. Show differences from previous attempt'
            ]
          },
          {
            name: 'Escalation',
            trigger: 'Multiple failed attempts OR low confidence',
            action: [
              '1. Flag for human review',
              '2. Notify support team',
              '3. Provide full context (query, attempts, feedback)'
            ]
          }
        ],
        pseudocode: `
class HumanInLoop:
  def process_feedback(self, conversation_id, user_feedback, rating):
    conv = self.db.get_conversation(conversation_id)
    
    # Store feedback
    self.db.store_feedback({
      'conversation_id': conversation_id,
      'feedback': user_feedback,
      'rating': rating,
      'timestamp': datetime.now()
    })
    
    # If negative feedback, trigger refinement
    if rating < 0.7:
      refined_query = self.refine_query_with_feedback(
        conv.original_query,
        user_feedback
      )
      
      # Run agent again with feedback
      new_context = conv.context + f"\\n[User Feedback]: {user_feedback}"
      result = agent.run(refined_query, context=new_context)
      
      # Store new attempt
      self.db.store_refinement_attempt({
        'conversation_id': conversation_id,
        'original_query': conv.original_query,
        'refined_query': refined_query,
        'feedback': user_feedback,
        'new_result': result
      })
      
      return result
    
    # If positive, cache as success
    elif rating > 0.8:
      self.cache_successful_pattern(conv)
      
    return None
    
  def trigger_escalation(self, conversation_id, reason):
    self.db.create_escalation({
      'conversation_id': conversation_id,
      'reason': reason,
      'timestamp': datetime.now(),
      'context': self.get_full_context(conversation_id),
      'status': 'pending'
    })
        `
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Agentic RAG Low-Level Design
          </h1>
          <p className="text-xl text-slate-300">Production-Ready Architecture with Full Pipeline</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['architecture', 'simulation', 'components', 'code'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Architecture Tab */}
        {activeTab === 'architecture' && (
          <div className="space-y-8">
            {/* Full System Diagram */}
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">System Architecture</h2>
              
              <div className="space-y-4">
                {/* User Layer */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Users size={24} />
                    <h3 className="text-lg font-bold">User Interface</h3>
                  </div>
                  <p className="text-sm text-blue-100">Web UI → Send query, View results, Provide feedback</p>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-blue-400 text-2xl">↓</div>

                {/* Agent Core */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Brain size={24} />
                    <h3 className="text-lg font-bold">Agent Loop (ReAct)</h3>
                  </div>
                  <div className="text-sm text-purple-100 space-y-1">
                    <p>1. Thought: Analyze query & context</p>
                    <p>2. Action: Decide which tool to call</p>
                    <p>3. Observation: Get tool result</p>
                    <p>4. Repeat or Stop based on confidence</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-purple-400 text-2xl">↓</div>

                {/* Tool Execution Layer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Database, title: 'Vector DB', desc: 'Semantic search' },
                    { icon: Zap, title: 'External APIs', desc: 'Real-time data' },
                    { icon: Database, title: 'SQL Database', desc: 'Structured data' }
                  ].map((tool, idx) => {
                    const Icon = tool.icon;
                    return (
                      <div key={idx} className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon size={20} />
                          <h4 className="font-bold text-sm">{tool.title}</h4>
                        </div>
                        <p className="text-xs text-green-100">{tool.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-green-400 text-2xl">↓</div>

                {/* Processing Layer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock size={24} />
                      <h3 className="font-bold">Memory System</h3>
                    </div>
                    <p className="text-sm text-orange-100">Context buffer, Cache, Long-term storage</p>
                  </div>

                  <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle size={24} />
                      <h3 className="font-bold">Evaluation Engine</h3>
                    </div>
                    <p className="text-sm text-pink-100">Quality checks, Fact verification, Hallucination detection</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-orange-400 text-2xl">↓</div>

                {/* Output Layer */}
                <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle size={24} />
                    <h3 className="text-lg font-bold">Response + Human Loop</h3>
                  </div>
                  <div className="text-sm text-cyan-100 space-y-1">
                    <p>✓ Generate answer with sources</p>
                    <p>✓ Show confidence & evaluation results</p>
                    <p>✓ Accept user feedback for refinement</p>
                    <p>✓ Trigger escalation if needed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Design Decisions */}
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Key Design Decisions</h2>
              <div className="space-y-4">
                {[
                  { title: 'Why Pinecone for Vector DB?', reason: 'Managed service (no ops), 90% cost reduction vs Milvus, serverless scaling, metadata filtering' },
                  { title: 'Why MCP over direct SDK calls?', reason: 'Tool-agnostic, easy to add tools, standardized interface, better for testing' },
                  { title: 'Why Redis for cache?', reason: 'Sub-millisecond latency, 10x cost savings on repeated searches, seamless integration' },
                  { title: 'Why separate evaluation?', reason: 'Quality gates before human, catches hallucinations, triggers human review, tracks metrics' },
                  { title: 'Why explicit human loop?', reason: 'Improves over time, catches edge cases, builds trust, provides training data' }
                ].map((decision, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <p className="font-bold text-white mb-2">{decision.title}</p>
                    <p className="text-slate-300 text-sm">{decision.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Simulation Tab */}
        {activeTab === 'simulation' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Live Simulation: ReAct Loop</h2>
                <button
                  onClick={() => setSimulationRunning(!simulationRunning)}
                  className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 ${
                    simulationRunning
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {simulationRunning ? (
                    <>
                      <Pause size={20} />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      Start Simulation
                    </>
                  )}
                </button>
              </div>

              {/* Step Counter */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-slate-300">
                  Step <span className="text-purple-400 font-bold text-lg">{simulationStep + 1}</span> of{' '}
                  <span className="text-purple-400 font-bold text-lg">{simulationSteps.length}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSimulationStep(Math.max(0, simulationStep - 1))}
                    className="px-4 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setSimulationStep(Math.min(simulationSteps.length - 1, simulationStep + 1))}
                    className="px-4 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Current Step Detail */}
              {simulationStep < simulationSteps.length && (
                <div className="bg-slate-900/50 rounded-lg p-6 border-2 border-purple-500 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-slate-400 text-sm">Step {simulationSteps[simulationStep].step}</p>
                      <h3 className="text-2xl font-bold text-white">{simulationSteps[simulationStep].component}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm font-bold ${
                      simulationSteps[simulationStep].status === 'input' ? 'bg-blue-500/20 text-blue-300' :
                      simulationSteps[simulationStep].status === 'api_call' ? 'bg-green-500/20 text-green-300' :
                      simulationSteps[simulationStep].status === 'evaluation' ? 'bg-pink-500/20 text-pink-300' :
                      simulationSteps[simulationStep].status === 'human_loop' ? 'bg-yellow-500/20 text-yellow-300' :
                      simulationSteps[simulationStep].status === 'memory' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-purple-500/20 text-purple-300'
                    }`}>
                      {simulationSteps[simulationStep].status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-slate-800 p-4 rounded border border-slate-700 mb-4">
                    <p className="text-white font-mono text-sm">{simulationSteps[simulationStep].action}</p>
                  </div>

                  <p className="text-slate-300 text-sm">{simulationSteps[simulationStep].details}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-bold mb-3">EXECUTION TIMELINE</p>
                <div className="space-y-1">
                  {simulationSteps.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSimulationStep(idx)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        idx === simulationStep
                          ? 'bg-purple-600 text-white'
                          : idx < simulationStep
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{s.step}</span>
                        <span className="text-sm flex-1">{s.component}</span>
                        {idx < simulationStep && <CheckCircle size={16} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Components Tab */}
        {activeTab === 'components' && (
          <div className="space-y-4">
            {Object.entries(components).map(([key, comp]) => (
              <div
                key={key}
                className={`rounded-xl border transition-all cursor-pointer ${
                  expandedComponent === key
                    ? 'bg-slate-800/50 border-purple-500'
                    : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                }`}
              >
                <button
                  onClick={() => setExpandedComponent(expandedComponent === key ? '' : key)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{comp.name}</h3>
                      <p className="text-slate-400">{comp.description}</p>
                    </div>
                    <div className="text-2xl">{expandedComponent === key ? '▼' : '▶'}</div>
                  </div>
                </button>

                {expandedComponent === key && (
                  <div className="px-6 pb-6 pt-0 space-y-4 border-t border-slate-700">
                    <div>
                      <h4 className="font-bold text-white mb-2">Responsibilities:</h4>
                      <ul className="space-y-1">
                        {comp.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-slate-300 text-sm flex gap-2">
                            <span className="text-purple-400">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-white mb-2">Implementation Details:</h4>
                      <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                        {key === 'vectordb' && (
                          <div className="space-y-2 text-sm text-slate-300">
                            <p><strong>Recommended:</strong> {comp.implementation.choice}</p>
                            <p><strong>Alternatives:</strong> {comp.implementation.alternatives.join(', ')}</p>
                            <p><strong>Vector Dimension:</strong> {comp.implementation.schema.vector_dim}</p>
                            <p><strong>Metric:</strong> {comp.implementation.schema.metric}</p>
                            <p><strong>Metadata Fields:</strong></p>
                            <ul className="ml-4 space-y-1">
                              {comp.implementation.schema.metadata_fields.map((field, idx) => (
                                <li key={idx}>• {field}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {key === 'mcp' && (
                          <div className="space-y-2 text-sm text-slate-300">
                            <p><strong>Architecture:</strong> {comp.implementation.architecture}</p>
                            <p><strong>Tools Available:</strong></p>
                            <ul className="ml-4 space-y-1">
                              {comp.implementation.tools.map((tool, idx) => (
                                <li key={idx}>• {tool.name} → {tool.returns}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {key === 'memory' && (
                          <div className="space-y-2 text-sm text-slate-300">
                            {comp.implementation.layers.map((layer, idx) => (
                              <div key={idx} className="bg-slate-800 p-2 rounded">
                                <p><strong>{layer.name}</strong> (TTL: {layer.ttl})</p>
                                <p className="text-xs text-slate-400">Storage: {layer.storage}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {key === 'evaluation' && (
                          <div className="space-y-2 text-sm text-slate-300">
                            {comp.implementation.metrics.map((metric, idx) => (
                              <div key={idx} className="bg-slate-800 p-2 rounded">
                                <p><strong>{metric.name}</strong> (threshold: {metric.threshold})</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {key === 'humanloop' && (
                          <div className="space-y-2 text-sm text-slate-300">
                            {comp.implementation.flows.map((flow, idx) => (
                              <div key={idx} className="bg-slate-800 p-2 rounded">
                                <p><strong>{flow.name}</strong></p>
                                <p className="text-xs text-slate-400">Trigger: {flow.trigger}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Code Tab */}
        {activeTab === 'code' && (
          <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Minimal Working Implementation</h2>

            <div className="space-y-6">
              {/* Main Agent Code */}
              <div>
                <h3 className="font-bold text-white mb-3">1. Agent Core Loop (agent.py)</h3>
                <div className="bg-slate-900 p-4 rounded border border-slate-700 overflow-x-auto">
                  <pre className="text-slate-300 font-mono text-xs">
{`from langchain.llms import Anthropic
from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.tools import tool
import redis
from pinecone import Pinecone

# Initialize clients
llm = Anthropic(model="claude-3-5-sonnet")
redis_client = redis.Redis()
pinecone_client = Pinecone()
vector_store = pinecone_client.Index("documents")

# Define tools
@tool
def search_documents(query: str, top_k: int = 5):
    """Search vector database for relevant documents"""
    from langchain.embeddings import OpenAIEmbeddings
    embeddings = OpenAIEmbeddings()
    
    # Check cache first
    cache_key = f"search:{query}"
    cached = redis_client.get(cache_key)
    if cached:
        return cached
    
    query_embedding = embeddings.embed_query(query)
    results = vector_store.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    
    redis_client.set(cache_key, str(results), ex=3600)
    return results

@tool
def query_api(endpoint: str, method: str = "GET"):
    """Call external API for real-time data"""
    import requests
    response = requests.request(method, endpoint)
    return response.json()

@tool
def fact_check(claim: str, context: str):
    """Verify claim against context using NLI"""
    from transformers import pipeline
    nli = pipeline("zero-shot-classification")
    result = nli(claim, [context])
    return result['scores'][0]  # Entailment score

# Create agent
tools = [search_documents, query_api, fact_check]
agent = create_react_agent(llm, tools)
agent_executor = AgentExecutor.from_agent_and_tools(
    agent=agent,
    tools=tools,
    max_iterations=5,
    early_stopping_method="generate"
)

# Run agent
def run_agentic_rag(query: str):
    memory = {"messages": [], "context": ""}
    
    try:
        result = agent_executor.invoke(
            {"input": query},
            return_intermediate_steps=True
        )
        
        # Evaluate response
        evaluated = evaluate_response(
            query, 
            result['output'],
            result.get('intermediate_steps', [])
        )
        
        # Store in memory
        memory["messages"].append({
            "role": "user",
            "content": query
        })
        memory["messages"].append({
            "role": "assistant",
            "content": result['output']
        })
        
        return {
            "answer": result['output'],
            "evaluation": evaluated,
            "memory": memory
        }
        
    except Exception as e:
        trigger_human_escalation(query, str(e))
        return {"error": str(e)}`}
                  </pre>
                </div>
              </div>

              {/* Evaluation Code */}
              <div>
                <h3 className="font-bold text-white mb-3">2. Evaluation Engine (evaluation.py)</h3>
                <div className="bg-slate-900 p-4 rounded border border-slate-700 overflow-x-auto">
                  <pre className="text-slate-300 font-mono text-xs">
{`from transformers import pipeline
import numpy as np

class ResponseEvaluator:
    def __init__(self):
        self.nli = pipeline("zero-shot-classification")
    
    def evaluate(self, query, docs, answer, agent_thoughts):
        scores = {}
        
        # 1. Relevance: Are docs relevant to query?
        from langchain.embeddings import OpenAIEmbeddings
        embeddings = OpenAIEmbeddings()
        query_emb = embeddings.embed_query(query)
        doc_embs = [embeddings.embed_query(doc) for doc in docs]
        
        relevance_scores = [
            np.dot(query_emb, de) / (np.linalg.norm(query_emb) * np.linalg.norm(de))
            for de in doc_embs
        ]
        scores['relevance'] = max(relevance_scores) if relevance_scores else 0
        
        # 2. Factuality: Claims supported by sources?
        claims = extract_claims(answer)
        source_text = " ".join(docs)
        
        factuality_scores = []
        for claim in claims:
            entailment_score = self.nli(claim, [source_text])['scores'][0]
            factuality_scores.append(entailment_score)
        
        scores['factuality'] = np.mean(factuality_scores) if factuality_scores else 1.0
        
        # 3. Hallucination rate
        hallucinations = [
            claim for claim in claims
            if self.nli(claim, [source_text])['scores'][0] < 0.3
        ]
        scores['hallucination_rate'] = len(hallucinations) / len(claims) if claims else 0
        
        # 4. Confidence
        confidence_words = ['confident', 'certain', 'clear', 'definitely']
        scores['confidence'] = sum(
            1 for word in confidence_words if word in agent_thoughts.lower()
        ) / len(confidence_words)
        
        # Determine if passes quality gate
        passed = (
            scores['hallucination_rate'] < 0.1 and
            scores['relevance'] > 0.7 and
            scores['confidence'] > 0.3
        )
        
        return {
            'passed': passed,
            'scores': scores,
            'needs_review': scores['hallucination_rate'] > 0.05
        }

def extract_claims(text):
    """Simple claim extraction - use BERT for production"""
    sentences = text.split('.')
    return [s.strip() for s in sentences if len(s.strip()) > 20]`}
                  </pre>
                </div>
              </div>

              {/* Memory Code */}
              <div>
                <h3 className="font-bold text-white mb-3">3. Memory System (memory.py)</h3>
                <div className="bg-slate-900 p-4 rounded border border-slate-700 overflow-x-auto">
                  <pre className="text-slate-300 font-mono text-xs">
{`import redis
import json
from datetime import datetime, timedelta
import psycopg2

class MemorySystem:
    def __init__(self, redis_url="localhost:6379", db_url="postgresql://..."):
        self.redis = redis.from_url(redis_url)
        self.db = psycopg2.connect(db_url)
        self.context_buffer = []
    
    def add_message(self, role, content, metadata=None):
        """Add to context buffer and persistent storage"""
        message = {
            "role": role,  # user, assistant, tool, evaluation
            "content": content,
            "timestamp": datetime.now().isoformat(),
            "metadata": metadata
        }
        
        self.context_buffer.append(message)
        
        # Store to database
        cur = self.db.cursor()
        cur.execute(
            "INSERT INTO conversation_messages (role, content, metadata, timestamp) VALUES (%s, %s, %s, %s)",
            (role, content, json.dumps(metadata), message["timestamp"])
        )
        self.db.commit()
        
        # If buffer too large, summarize
        if len(self.context_buffer) > 50:
            self.summarize_and_archive()
    
    def get_context(self, max_tokens=2000):
        """Get most relevant context for next LLM call"""
        # Weight by recency and relevance
        relevant = sorted(
            self.context_buffer[-30:],  # Last 30 items
            key=lambda x: (x["role"] in ["evaluation", "tool"], x["timestamp"]),
            reverse=True
        )
        
        # Fit within token limit
        tokens = 0
        context = []
        for msg in relevant:
            msg_tokens = len(msg["content"].split())
            if tokens + msg_tokens < max_tokens:
                context.append(msg)
                tokens += msg_tokens
        
        return context
    
    def cache_tool_result(self, tool_name, args, result, ttl=3600):
        """Cache tool results to avoid duplicate calls"""
        cache_key = f"{tool_name}:{hash(str(args))}"
        self.redis.set(
            cache_key,
            json.dumps(result),
            ex=ttl
        )
    
    def get_cached_result(self, tool_name, args):
        """Retrieve cached tool result if exists"""
        cache_key = f"{tool_name}:{hash(str(args))}"
        cached = self.redis.get(cache_key)
        return json.loads(cached) if cached else None
    
    def summarize_and_archive(self):
        """Summarize old context and archive to database"""
        # Summarize oldest 20 messages
        to_summarize = self.context_buffer[:20]
        
        from langchain.llms import Anthropic
        llm = Anthropic()
        
        text = "\\n".join([f"{m['role']}: {m['content']}" for m in to_summarize])
        summary = llm.predict(f"Summarize this conversation:\\n{text}")
        
        # Store summary and remove from buffer
        self.add_message("system", f"[SUMMARY] {summary}")
        self.context_buffer = self.context_buffer[20:]`}
                  </pre>
                </div>
              </div>

              {/* Human Loop Code */}
              <div>
                <h3 className="font-bold text-white mb-3">4. Human-in-the-Loop (human_loop.py)</h3>
                <div className="bg-slate-900 p-4 rounded border border-slate-700 overflow-x-auto">
                  <pre className="text-slate-300 font-mono text-xs">
{`class HumanInLoop:
    def __init__(self, db):
        self.db = db
        self.agent = None  # Will be set by main app
    
    def process_feedback(self, conversation_id, rating, feedback_text=None):
        """Handle user feedback and trigger refinement if needed"""
        
        # Store feedback
        self.db.execute("""
            INSERT INTO feedback (conversation_id, rating, text, timestamp)
            VALUES (%s, %s, %s, NOW())
        """, (conversation_id, rating, feedback_text))
        
        # If negative, trigger refinement
        if rating < 0.7 and feedback_text:
            return self.refine_response(conversation_id, feedback_text)
        
        # If positive, cache as success pattern
        elif rating > 0.8:
            self.cache_success(conversation_id)
        
        return None
    
    def refine_response(self, conversation_id, feedback):
        """Re-run agent with user feedback"""
        conv = self.db.get_conversation(conversation_id)
        
        # Modify prompt with feedback
        refined_prompt = f"""
        Previous answer wasn't satisfactory.
        Original query: {conv['query']}
        User feedback: {feedback}
        
        Please try again with the feedback in mind.
        """
        
        # Run agent again
        result = self.agent.run_agentic_rag(refined_prompt)
        
        # Store refinement attempt
        self.db.execute("""
            INSERT INTO refinement_attempts 
            (conversation_id, feedback, new_result, timestamp)
            VALUES (%s, %s, %s, NOW())
        """, (conversation_id, feedback, result))
        
        return result
    
    def trigger_escalation(self, conversation_id, reason):
        """Escalate to human review"""
        context = self.db.get_full_context(conversation_id)
        
        self.db.execute("""
            INSERT INTO escalations 
            (conversation_id, reason, context, status, timestamp)
            VALUES (%s, %s, %s, 'pending', NOW())
        """, (conversation_id, reason, json.dumps(context)))
        
        # Notify support team (email, Slack, etc)
        notify_support_team({
            'conversation_id': conversation_id,
            'reason': reason,
            'context': context
        })`}
                  </pre>
                </div>
              </div>

              {/* Config Code */}
              <div>
                <h3 className="font-bold text-white mb-3">5. Configuration (config.py)</h3>
                <div className="bg-slate-900 p-4 rounded border border-slate-700 overflow-x-auto">
                  <pre className="text-slate-300 font-mono text-xs">
{`# config.py - All system parameters in one place

# Vector DB
VECTOR_DB_PROVIDER = "pinecone"  # or "weaviate"
VECTOR_DB_INDEX = "documents"
VECTOR_DIMENSION = 1536
EMBEDDING_MODEL = "text-embedding-3-large"
METADATA_FIELDS = [
    "source_doc", "chunk_id", "timestamp", 
    "document_type", "section"
]

# Agent Configuration
MAX_AGENT_ITERATIONS = 5
AGENT_TIMEOUT_SECONDS = 30
AGENT_MODEL = "claude-3-5-sonnet"

# Memory Configuration
CONTEXT_BUFFER_MAX = 50
LONG_TERM_MEMORY_TTL_DAYS = 30
TOOL_CACHE_TTL_SECONDS = 3600
CONTEXT_TOKEN_LIMIT = 2000

# Evaluation Thresholds
RELEVANCE_THRESHOLD = 0.7
HALLUCINATION_THRESHOLD = 0.05
CONFIDENCE_THRESHOLD = 0.6
FACTUALITY_THRESHOLD = 0.8

# Human Loop Configuration
AUTO_ESCALATE_ON_HALLUCINATION = True
AUTO_ESCALATE_ON_LOW_CONFIDENCE = True
MAX_REFINEMENT_ATTEMPTS = 3
FEEDBACK_RATING_THRESHOLD = 0.7

# Database
DATABASE_URL = "postgresql://user:pass@localhost/agentic_rag"
REDIS_URL = "redis://localhost:6379"

# Logging & Monitoring
LOG_LEVEL = "INFO"
ENABLE_CONVERSATION_LOGGING = True
ENABLE_METRIC_TRACKING = True
METRIC_EXPORT_INTERVAL_SECONDS = 60`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
