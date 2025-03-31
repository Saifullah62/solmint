'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { generateSecurityReport, RiskLevel, SecurityIssue } from '@/lib/tokenValidator';
import { CheckCircle, AlertCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

interface SecurityReport {
  issues: SecurityIssue[];
  score: number;
  summary: string;
}

export const SecurityAuditor: React.FC = () => {
  const { tokenConfig } = useAppStore();
  const [securityReport, setSecurityReport] = useState<SecurityReport>({
    issues: [],
    score: 0,
    summary: '',
  });

  // Update security report when token configuration changes
  useEffect(() => {
    if (!tokenConfig.name && !tokenConfig.symbol) return;
    
    const report = generateSecurityReport(tokenConfig);
    setSecurityReport(report);
  }, [tokenConfig]);

  // Get color based on risk level
  const getRiskLevelColor = (riskLevel: RiskLevel): string => {
    switch (riskLevel) {
      case RiskLevel.CRITICAL:
        return 'text-red-500';
      case RiskLevel.HIGH:
        return 'text-orange-500';
      case RiskLevel.MEDIUM:
        return 'text-yellow-500';
      case RiskLevel.LOW:
        return 'text-blue-500';
      case RiskLevel.NONE:
      default:
        return 'text-green-500';
    }
  };

  // Get icon based on risk level
  const getRiskLevelIcon = (riskLevel: RiskLevel): React.ReactNode => {
    switch (riskLevel) {
      case RiskLevel.CRITICAL:
        return <XCircle className="h-5 w-5" />;
      case RiskLevel.HIGH:
        return <AlertCircle className="h-5 w-5" />;
      case RiskLevel.MEDIUM:
        return <AlertTriangle className="h-5 w-5" />;
      case RiskLevel.LOW:
        return <HelpCircle className="h-5 w-5" />;
      case RiskLevel.NONE:
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  // Get score color based on score value
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  // If no token configuration, show placeholder
  if (!tokenConfig.name && !tokenConfig.symbol) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Security Audit</h3>
        <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-md">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="font-medium text-gray-900 dark:text-white">Configure your token first</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Security analysis will appear once you start configuring your token.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Security Audit</h3>
      
      {/* Security Score */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">Security Score</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{securityReport.summary}</p>
        </div>
        <div className={`text-3xl font-bold ${getScoreColor(securityReport.score)}`}>
          {securityReport.score}/100
        </div>
      </div>
      
      {/* Security Issues */}
      <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
        {securityReport.issues.length > 0 
          ? `Security Issues (${securityReport.issues.length})` 
          : 'Security Issues'}
      </h4>
      
      {securityReport.issues.length > 0 ? (
        <div className="space-y-4">
          {securityReport.issues.map((issue: SecurityIssue) => (
            <div key={issue.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${getRiskLevelColor(issue.riskLevel)}`}>
                  {getRiskLevelIcon(issue.riskLevel)}
                </div>
                <div>
                  <h4 className="text-base font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                    {issue.title}
                    <span className={`text-xs px-2 py-0.5 rounded-full uppercase ${getRiskLevelColor(issue.riskLevel)} bg-opacity-10`}>
                      {issue.riskLevel}
                    </span>
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{issue.description}</p>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Recommendation:</span> {issue.recommendation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-md">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="font-medium text-gray-900 dark:text-white">No security issues detected</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your token configuration looks great! No security issues were found.
          </p>
        </div>
      )}
    </div>
  );
};

export default SecurityAuditor;
